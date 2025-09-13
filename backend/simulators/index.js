export { GenericBigWinSimulator } from './BigWinSimulator.js';
export { GenericSlotSimulator } from './SlotSimulator.js';
export { GenericSlotSimulatorEnhanced } from './SlotSimulatorEnhanced.js';

export function createSimulator(SlotBackendClass, numSpins, bet, type = 'bigwin') {
    switch(type) {
        case 'bigwin':
            return new GenericBigWinSimulator(SlotBackendClass, numSpins, bet);
        case 'simple':
            return new GenericSlotSimulator(SlotBackendClass, numSpins, bet);
        case 'enhanced':
            return new GenericSlotSimulatorEnhanced(SlotBackendClass, numSpins, bet);
        default:
            return new GenericBigWinSimulator(SlotBackendClass, numSpins, bet);
    }
}