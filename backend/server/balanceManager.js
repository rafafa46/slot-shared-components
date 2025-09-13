import Decimal from 'decimal.js';
import fs from 'fs';
import path from 'path';

class BalanceManager {
    constructor() {
        this.accounts = new Map();
        this.filePath = path.join(process.cwd(), 'accounts.json');
        this.loadAccounts();
    }

    loadAccounts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            const accounts = JSON.parse(data);
            this.accounts = new Map(Object.entries(accounts).map(([userId, account]) => [
                userId,
                {
                    balance: new Decimal(account.balance),
                    currency: account.currency
                }
            ]));
        } catch (error) {
            console.log('No existing accounts found or error reading file. Starting with empty accounts.');
        }
    }

    saveAccounts() {
        const accounts = Object.fromEntries(
            Array.from(this.accounts.entries()).map(([userId, account]) => [
                userId,
                {
                    balance: account.balance.toString(),
                    currency: account.currency
                }
            ])
        );
        fs.writeFileSync(this.filePath, JSON.stringify(accounts, null, 2));
    }

    initializeBalance(userId, initialBalance, currencySymbol) {
        const account = {
            balance: new Decimal(initialBalance),
            currency: currencySymbol
        };
        this.accounts.set(userId, account);
        this.saveAccounts();
        return account;
    }

    getBalance(userId) {
        const account = this.accounts.get(userId);
        if (!account) return { balance: new Decimal(0), currency: null };
        return account;
    }

    updateBalance(userId, newBalance) {
        const account = this.accounts.get(userId);
        if (!account) return false;
        account.balance = new Decimal(newBalance);
        this.saveAccounts();
        return true;
    }

    hasSufficientFunds(userId, amount) {
        const account = this.getBalance(userId);
        return account.balance.greaterThanOrEqualTo(new Decimal(amount));
    }
}

export const balanceManager = new BalanceManager();