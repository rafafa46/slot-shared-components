import { gameService } from "../../../services/GameService.js"

export const formatCurrency = (amount) => {
    const currency = gameService.currency;

    if (amount == null) return `${currency}0.00`;
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) {
        return `0.00${currency}`;
    }
    
    const formatted = numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    });
    
    return `${currency}${formatted}`;
};