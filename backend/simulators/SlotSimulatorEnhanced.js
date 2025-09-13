// backend/simulators/SlotSimulatorEnhanced.js - Version générique
import fs from 'fs';
import path from 'path';
import Decimal from 'decimal.js';

export class GenericSlotSimulatorEnhanced {
    constructor(SlotBackendClass, numSpins = 1000, bet = 1) {
        this.SlotBackendClass = SlotBackendClass;  // ✅ Prendre SlotBackend en paramètre
        this.numSpins = numSpins;
        this.bet = bet;
        this.stats = {
            totalAmount: new Decimal(0),
            bonusTriggered: 0,
            superBonusTriggered: 0,
            averageSpinAmount: new Decimal(0),
            maxAmount: new Decimal(0),
            minAmount: new Decimal(Infinity),
            errorCount: 0
        };
        this.progressLogs = [];
        this.logInterval = Math.max(100, Math.floor(numSpins / 100));
        this.spinResults = [];
        this.specialTileResults = [];
        this.batchSize = 1000;
    }

    // Toutes les méthodes utilitaires restent identiques
    findNextAvailableNumber(baseName, extension) {
        let counter = 2;
        const baseDir = process.cwd();
        
        while (fs.existsSync(path.join(baseDir, `${baseName}_${counter}${extension}`))) {
            counter++;
        }
        
        return counter;
    }

    renameExistingFiles(filename) {
        const baseDir = process.cwd();
        const filePath = path.join(baseDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return;
        }

        const parsedPath = path.parse(filename);
        const baseName = parsedPath.name;
        const extension = parsedPath.ext;
        const nextNumber = this.findNextAvailableNumber(baseName, extension);

        for (let i = nextNumber - 1; i >= 2; i--) {
            const currentFile = path.join(baseDir, `${baseName}_${i}${extension}`);
            const newFile = path.join(baseDir, `${baseName}_${i + 1}${extension}`);
            
            if (fs.existsSync(currentFile)) {
                fs.renameSync(currentFile, newFile);
            }
        }

        const newMainFile = path.join(baseDir, `${baseName}_2${extension}`);
        fs.renameSync(filePath, newMainFile);
        
        console.log(`Fichier existant renommé: ${filename} -> ${baseName}_2${extension}`);
    }

    runSimulation() {
        const startTime = Date.now();
        
        this.renameExistingFiles('spin_results_enhanced.csv');
        this.renameExistingFiles('specialTileRepartitionBonus.csv');
        this.renameExistingFiles('server_errors.log');
        
        const logStream = fs.createWriteStream(path.join(process.cwd(), 'spin_results_enhanced.csv'), { flags: 'w' });
        const specialTileStream = fs.createWriteStream(path.join(process.cwd(), 'specialTileRepartitionBonus.csv'), { flags: 'w' });
        const errorStream = fs.createWriteStream(path.join(process.cwd(), 'server_errors.log'), { flags: 'w' });
        
        logStream.write('SpinNumber,BaseGameAmount,BonusAmount,SuperBonusAmount,TotalAmount,BaseGameFinalWilds,BonusFinalWilds,BaseGameFinalActiveSymbols,BonusFinalActiveSymbols,BaseGameFinalCrowns,BonusFinalCrowns,BaseGameTotalMulti,BonusTotalMulti,BaseGameSpecialSymbolCount,BonusSpecialSymbolCount\n');
        specialTileStream.write('SpinNumber,spinCount,spinsRemaining,specialSymbolCount\n');

        for (let i = 0; i < this.numSpins; i++) {
            try {
                // ✅ Utiliser la classe SlotBackend passée en paramètre
                const spin = new this.SlotBackendClass("quintupleChance", this.bet);
                const result = spin.launchSpin();

                this.updateStats(result);
                const analysisData = this.analyzeResult(result);

                let bonusAmount = "";
                let superBonusAmount = "";
                
                if (result.bonusTriggered) {
                    bonusAmount = result.bonusAmount.toString();
                }
                if (result.superBonusTriggered) {
                    superBonusAmount = result.bonusAmount.toString();
                }

                this.spinResults.push({
                    spinNumber: i + 1,
                    baseGameAmount: result.baseGameAmount.toString(),
                    bonusAmount: bonusAmount,
                    superBonusAmount: superBonusAmount,
                    totalAmount: result.totalAmount.toString(),
                    ...analysisData
                });

                this.analyzeSpecialTiles(result, i + 1);

                if (this.spinResults.length >= this.batchSize) {
                    this.writeResultsBatch(logStream);
                }

                if (this.specialTileResults.length >= this.batchSize) {
                    this.writeSpecialTilesBatch(specialTileStream);
                }
                
                if (i % this.logInterval === 0 || i === this.numSpins - 1) {
                    this.logProgress(i + 1, startTime);
                }
            } catch (error) {
                this.handleError(i, error, errorStream);
            }
        }

        if (this.spinResults.length > 0) {
            this.writeResultsBatch(logStream);
        }

        if (this.specialTileResults.length > 0) {
            this.writeSpecialTilesBatch(specialTileStream);
        }

        logStream.end();
        specialTileStream.end();
        errorStream.end();
        this.finalizeStats();
    }

    // Méthodes d'analyse - restent identiques
    analyzeResult(result) {
        const analysis = {
            baseGameFinalWilds: 0,
            bonusFinalWilds: 0,
            baseGameFinalActiveSymbols: 0,
            bonusFinalActiveSymbols: 0,
            baseGameFinalCrowns: "",
            bonusFinalCrowns: "",
            baseGameTotalMulti: 0,
            bonusTotalMulti: 0,
            baseGameSpecialSymbolCount: 0,
            bonusSpecialSymbolCount: 0
        };

        if (result.spins && result.spins.length > 0) {
            const lastBaseGameSpin = result.spins[result.spins.length - 1];
            if (lastBaseGameSpin.symbolPanel) {
                const baseGameData = this.analyzeSymbolPanel(lastBaseGameSpin.symbolPanel);
                analysis.baseGameFinalWilds = baseGameData.wilds;
                analysis.baseGameFinalActiveSymbols = baseGameData.activeSymbols;
                analysis.baseGameFinalCrowns = baseGameData.crowns;
                analysis.baseGameTotalMulti = baseGameData.totalMultipliers;
            }
            
            analysis.baseGameSpecialSymbolCount = result.spins.reduce((total, spin) => {
                return total + (spin.specialSymbols ? spin.specialSymbols.length : 0);
            }, 0);
        }

        if (result.bonus && result.bonus.spins && result.bonus.spins.length > 0) {
            const lastBonusSpin = result.bonus.spins[result.bonus.spins.length - 1];
            if (lastBonusSpin.symbolPanel) {
                const bonusData = this.analyzeSymbolPanel(lastBonusSpin.symbolPanel);
                analysis.bonusFinalWilds = bonusData.wilds;
                analysis.bonusFinalActiveSymbols = bonusData.activeSymbols;
                analysis.bonusFinalCrowns = bonusData.crowns;
                analysis.bonusTotalMulti = bonusData.totalMultipliers;
            }
            
            analysis.bonusSpecialSymbolCount = result.bonus.spins.reduce((total, spin) => {
                return total + (spin.specialSymbols ? spin.specialSymbols.length : 0);
            }, 0);
        }

        return analysis;
    }

    analyzeSpecialTiles(result, spinNumber) {
        if (result.bonus && result.bonus.spins && Array.isArray(result.bonus.spins)) {
            result.bonus.spins.forEach(bonusSpin => {
                const specialSymbolCount = bonusSpin.specialSymbols ? bonusSpin.specialSymbols.length : 0;
                
                this.specialTileResults.push({
                    spinNumber: spinNumber,
                    spinCount: bonusSpin.spinCount || 0,
                    spinsRemaining: bonusSpin.spinsRemaining || 0,
                    specialSymbolCount: specialSymbolCount
                });
            });
        }
    }

    analyzeSymbolPanel(symbolPanel) {
        let wilds = 0;
        let activeSymbols = 0;
        let totalMultipliers = 0;
        const crowns = [];

        symbolPanel.forEach(tile => {
            if (tile.symbol && tile.symbol.type === "wild" && tile.count !== undefined) {
                wilds = tile.count;
            }

            if (tile.symbol.type === "normal" && tile.active === true) {
                activeSymbols++;
            }

            if (tile.multiplier !== undefined && tile.multiplier > 0) {
                totalMultipliers += tile.multiplier;
            }

            if (tile.crowns && Array.isArray(tile.crowns) && tile.crowns.length > 0) {
                crowns.push(...tile.crowns);
            }
        });

        return {
            wilds,
            activeSymbols,
            totalMultipliers,
            crowns: crowns.join(',')
        };
    }

    writeResultsBatch(stream) {
        const batchContent = this.spinResults.map(result => 
            `${result.spinNumber},${result.baseGameAmount},${result.bonusAmount},${result.superBonusAmount},${result.totalAmount},${result.baseGameFinalWilds},${result.bonusFinalWilds},${result.baseGameFinalActiveSymbols},${result.bonusFinalActiveSymbols},"${result.baseGameFinalCrowns}","${result.bonusFinalCrowns}",${result.baseGameTotalMulti},${result.bonusTotalMulti},${result.baseGameSpecialSymbolCount},${result.bonusSpecialSymbolCount}`
        ).join('\n');
        stream.write(batchContent + '\n');
        this.spinResults = [];
    }

    writeSpecialTilesBatch(stream) {
        const batchContent = this.specialTileResults.map(result => 
            `${result.spinNumber},${result.spinCount},${result.spinsRemaining},${result.specialSymbolCount}`
        ).join('\n');
        stream.write(batchContent + '\n');
        this.specialTileResults = [];
    }

    updateStats(result) {
        this.stats.totalAmount = this.stats.totalAmount.plus(result.totalAmount);
        if (result.bonusTriggered) {
            this.stats.bonusTriggered++;
        }
        if (result.superBonusTriggered) {
            this.stats.superBonusTriggered++;
        }
        this.stats.maxAmount = Decimal.max(this.stats.maxAmount, result.totalAmount);
        this.stats.minAmount = Decimal.min(this.stats.minAmount, result.totalAmount);
    }

    handleError(spinNumber, error, errorStream) {
        this.stats.errorCount++;
        
        const timestamp = new Date().toISOString();
        const errorMessage = `[${timestamp}] Spin ${spinNumber}: ${error.message}\nStack: ${error.stack}\n\n`;
        
        errorStream.write(errorMessage);
        
        if (this.stats.errorCount <= 10) {
            this.progressLogs.push(`Error on spin ${spinNumber}: ${error.message}`);
        }
    }

    finalizeStats() {
        this.stats.averageSpinAmount = this.stats.totalAmount.dividedBy(this.numSpins);
    }

    logProgress(currentSpin, startTime) {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const progress = (currentSpin / this.numSpins * 100).toFixed(2);
        const spinsPerSecond = (currentSpin / elapsedTime).toFixed(2);
        
        this.progressLogs.push(`Processed ${currentSpin}/${this.numSpins} spins (${progress}%) - ${spinsPerSecond} spins/sec`);
    }

    getSimulationResults() {
        return {
            stats: {
                totalAmount: this.stats.totalAmount.toString(),
                bonusTriggered: this.stats.bonusTriggered,
                superBonusTriggered: this.stats.superBonusTriggered,
                averageSpinAmount: this.stats.averageSpinAmount.toString(),
                maxAmount: this.stats.maxAmount.toString(),
                minAmount: this.stats.minAmount.toString(),
                errorCount: this.stats.errorCount
            },
            progressLogs: this.progressLogs
        };
    }
}