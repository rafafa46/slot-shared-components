// backend/simulators/BigWinSimulator.js - Version générique
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import Decimal from 'decimal.js';

export class GenericBigWinSimulator {
    constructor(SlotBackendClass, numSpins = 1000, bet = 1) {
        this.SlotBackendClass = SlotBackendClass;  // ✅ Prendre SlotBackend en paramètre
        this.numSpins = numSpins;
        this.bet = bet;
        this.progressLogs = [];
        this.logInterval = Math.max(200, Math.floor(numSpins / 100));
        this.bigWinThreshold = new Decimal(5000);
        this.stats = {
            totalBigWins: 0,
            errorCount: 0
        };
        
        // Initialisation du dossier big wins
        this.bigWinDir = path.join(process.cwd(), 'outputs_bigWin');
        if (!existsSync(this.bigWinDir)) {
            mkdirSync(this.bigWinDir); 
        }
    }

    async runSimulation() {
        const startTime = Date.now();

        for (let i = 0; i < this.numSpins; i++) {
            try {
                // ✅ Utiliser la classe SlotBackend passée en paramètre
                const spin = new this.SlotBackendClass("superBonus", this.bet);
                const result = spin.launchSpin();

                // Vérification des gros gains
                if (new Decimal(result.totalAmount).greaterThan(this.bigWinThreshold)) {
                    this.stats.totalBigWins++;
                    try {
                        const timestamp = Date.now();
                        const filename = `bigwin_${timestamp}_${i + 1}_${result.totalAmount}.json`;
                        const filepath = path.join(this.bigWinDir, filename);
                        const resultJSON = JSON.stringify(result, null, 2);
                        
                        await fs.writeFile(filepath, resultJSON);
                        const message = `Big win detected! Spin ${i + 1}, Amount: ${result.totalAmount}`;
                        console.log(message);
                        this.progressLogs.push(message);
                    } catch (error) {
                        console.error('Error saving big win file:', error);
                        this.handleError(i, error);
                    }
                }

                // Log de progression
                if (i % this.logInterval === 0 || i === this.numSpins - 1) {
                    this.logProgress(i + 1, startTime);
                }

            } catch (error) {
                this.handleError(i, error);
            }
        }
        
        const finalMessage = `Simulation completed. Total big wins detected: ${this.stats.totalBigWins}`;
        console.log(finalMessage);
        this.progressLogs.push(finalMessage);
    }

    handleError(spinNumber, error) {
        this.stats.errorCount++;
        const errorMessage = `Error on spin ${spinNumber}: ${error.message}`;
        console.error(errorMessage);
        if (this.stats.errorCount <= 10) {
            this.progressLogs.push(errorMessage);
        }
    }

    logProgress(currentSpin, startTime) {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const progress = (currentSpin / this.numSpins * 100).toFixed(2);
        const spinsPerSecond = (currentSpin / elapsedTime).toFixed(2);
        
        const message = `Processed ${currentSpin}/${this.numSpins} spins (${progress}%) - ${spinsPerSecond} spins/sec`;
        console.log(message);
        this.progressLogs.push(message);
    }

    getSimulationResults() {
        return {
            stats: {
                totalBigWins: this.stats.totalBigWins,
                errorCount: this.stats.errorCount
            },
            progressLogs: this.progressLogs
        };
    }
}