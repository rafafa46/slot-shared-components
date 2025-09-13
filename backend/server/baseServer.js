import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs/promises';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import Decimal from 'decimal.js';
import { balanceManager } from './balanceManager.js';
import { createSimulator } from '../simulators/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serveur générique - prend SlotBackend et config en paramètres
 */
export function createGameServer(SlotBackendClass, gameConfig, options = {}) {
    const app = express();
    const port = process.env.PORT || 3000;
    const JWT_SECRET = process.env.JWT_SECRET;

    const generalLimiter = rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 1000,
        message: { error: 'Too many requests, please try again later (1000 request per hour).' }
    });

    const logSecurityEvent = (event, userId, ip, details) => {
        console.log(`🔒 SECURITY: ${event} - User: ${userId} - IP: ${ip} - Details:`, details);
    };

    app.use(cors({
        origin: options.corsOrigins || ['http://localhost:8080', 'http://127.0.0.1:8080'],
        credentials: true
    }));

    app.use(helmet());
    app.use(generalLimiter);
    app.use(express.json());
    
    // ✅ Servir les fichiers statiques seulement si spécifié
    if (options.publicDir) {
        app.use(express.static(options.publicDir));
    }

    const verifyToken = (req, res, next) => {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

            jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ error: 'Token is invalid or expired' });
                } else {
                    req.userId = decoded.id;
                    next();
                }
            });
        } else {
            res.status(403).json({ error: 'No token provided' });
        }
    };

    app.post('/api/connect', (req, res) => {
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        const initialBalance = new Decimal(gameConfig.demoBalance);
        const currencySymbol = gameConfig.demoCurrency;

        const userAccount = balanceManager.initializeBalance(userId, initialBalance, currencySymbol);
        const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '24h' });

        console.log(`New user connected: ${userId} with initial balance: ${currencySymbol}${initialBalance}`);

        res.status(200).send({ 
            auth: true, 
            token: token, 
            balance: initialBalance.toString(),
            currency: currencySymbol
        });
    });

    app.post('/api/spin/:spinType', verifyToken, async (req, res) => {
        try {
            const { spinType } = req.params;
            const { bet } = req.body;
            const userId = req.userId;
            
            if (!gameConfig.featureCost[spinType]) {
                logSecurityEvent('INVALID_SPIN_TYPE', req.userId, req.ip, { spinType });
                return res.status(400).json({ error: 'Invalid spin type' });
            }
            
            if (!bet || typeof bet !== 'number' || bet <= 0 || bet > 100 || 
                Number.isNaN(bet) || !Number.isFinite(bet)) {
                console.log(`🔒 SECURITY: Invalid bet attempt - User: ${req.userId} - Bet: ${bet}`);
                return res.status(400).json({ error: 'Invalid bet amount' });
            }
            
            const costMultiplier = gameConfig.featureCost[spinType];
            const cost = new Decimal(bet).times(costMultiplier);
            const userAccount = balanceManager.getBalance(userId);
            let currentBalance = userAccount.balance;
            const currencySymbol = userAccount.currency;

            if (!balanceManager.hasSufficientFunds(userId, cost)) {
                return res.status(400).json({ error: 'Insufficient balance' });
            }

            console.log(`Processing ${spinType} for user ${userId} with bet ${currencySymbol}${bet}`);
            console.log(`Initial balance: ${currencySymbol}${currentBalance}`);
            
            currentBalance = currentBalance.minus(cost);
            balanceManager.updateBalance(userId, currentBalance);
            console.log(`Balance after bet: ${currencySymbol} ${currentBalance}`);
            
            // ✅ Utiliser la classe SlotBackend passée en paramètre
            const slotBackend = new SlotBackendClass(spinType, bet);
            const result = slotBackend.launchSpin();
            
            currentBalance = currentBalance.plus(result.totalAmount);
            balanceManager.updateBalance(userId, currentBalance);
            console.log(`Final balance after ${spinType}: ${currencySymbol} ${currentBalance}`);

            if (process.env.NODE_ENV !== 'production') {
                const resultJSON = JSON.stringify(result, null, 2);
                await fs.writeFile('output.json', resultJSON);
            }
            
            res.json({
                payload: result,
                newBalance: currentBalance.toNumber()
            });
        } catch (error) {
            console.error(`Error processing spin:`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Routes de simulation (dev uniquement)
    if (process.env.NODE_ENV !== 'production') {
        app.post('/api/run-simulation', async (req, res) => {
            try {
                const numSpins = req.body.numSpins || 1000;
                const bet = req.body.bet || 1;
                const simulatorType = req.body.simulatorType || 'bigwin';
                
                // ✅ Utiliser la factory de simulateurs
                const simulator = createSimulator(SlotBackendClass, numSpins, bet, simulatorType);
                simulator.runSimulation();
                res.json(simulator.getSimulationResults());
            } catch (error) {
                console.error('Error running simulation:', error);
                res.status(500).json({ error: 'Internal server error', details: error.message });
            }
        });
    }

    app.get('/', (req, res) => {
        res.json({ 
            message: `${options.gameName || 'Game'} API is running!`, 
            status: 'OK',
            timestamp: new Date().toISOString()
        });
    });

    app.get('/api/connect', (req, res) => {
        res.json({ 
            message: 'Use POST method to connect',
            endpoints: {
                connect: 'POST /api/connect',
                spin: 'POST /api/spin/:spinType'
            }
        });
    });

    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something went wrong!' });
    });

    return {
        app,
        start() {
            app.listen(port, '0.0.0.0', () => {
                console.log(`${options.gameName || 'Server'} listening on http://localhost:${port}`);
            });
        }
    };
}