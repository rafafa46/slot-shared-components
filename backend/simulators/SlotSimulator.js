// backend/simulators/SlotSimulator.js - Version générique
import fs from 'fs';
import path from 'path';
import Decimal from 'decimal.js';

export class GenericSlotSimulator {
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
        this.batchSize = 1000;
    }

    runSimulation() {
        const startTime = Date.now();
        const logStream = fs.createWriteStream(path.join(process.cwd(), 'spin_results.csv'), { flags: 'w' });
        logStream.write('SpinNumber,BaseGameAmount,BonusAmount,SuperBonusAmount,TotalAmount\n');

        for (let i = 0; i < this.numSpins; i++) {
            try {
                // ✅ Utiliser la classe SlotBackend passée en paramètre
                const spin = new this.SlotBackendClass("superSpin", this.bet);
                const result = spin.launchSpin();

                this.updateStats(result);

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
                    totalAmount: result.totalAmount.toString()
                });

                if (this.spinResults.length >= this.batchSize) {
                    this.writeResultsBatch(logStream);
                }
                
                if (i % this.logInterval === 0 || i === this.numSpins - 1) {
                    this.logProgress(i + 1, startTime);
                }
            } catch (error) {
                this.handleError(i, error);
            }
        }

        if (this.spinResults.length > 0) {
            this.writeResultsBatch(logStream);
        }

        logStream.end();
        this.finalizeStats();
    }

    writeResultsBatch(stream) {
        const batchContent = this.spinResults.map(result => 
            `${result.spinNumber},${result.baseGameAmount},${result.bonusAmount},${result.superBonusAmount},${result.totalAmount}`
        ).join('\n');
        stream.write(batchContent + '\n');
        this.spinResults = [];
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

    handleError(spinNumber, error) {
        this.stats.errorCount++;
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