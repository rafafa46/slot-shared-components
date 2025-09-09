class GameService {
    constructor() {
        this.sessionToken = null;
        this.useLocalData = false;
        this.localSpinData = null;
        this.currency = null;
        this.baseURL = null;
    }

    setLocalSpinData(data) {
        this.localSpinData = data;
        this.useLocalData = true;
    }

    deactivateLocalSpinData() {
        this.localSpinData = null;
        this.useLocalData = false;
    }

    async setLocalSpinFromFile(spinType) {
        try {
            const filePath = `/bigwins/${spinType}.json`;
            const response = await fetch(filePath);
            const data = await response.json();

            this.localSpinData = data;
            this.useLocalData = true;
            return true;
        } catch (error) {
            return { error: error.message || 'big win not found' };
        }
    }

    async initialize(config) {
        if (!config || !config.production_url || !config.development_url) {
            throw new Error('GameService: config with production_url and development_url required');
        }
        
        this.baseURL = config.environment === 'production' 
            ? config.production_url 
            : config.development_url;

        try {
            const response = await fetch(`${this.baseURL}/api/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Server connection failed: ${response.status}`);
            }

            const data = await response.json();
            this.sessionToken = data.token;
            this.currency = data.currency;

            return { 
                success: true, 
                balance: data.balance, 
                currency: data.currency 
            };

        } catch (error) {
            console.error('Error connecting to server:', error);
            return { success: false, error: error.message };
        }
    }

    async makeSpinRequest(spinType, bet) {
        if (spinType.startsWith("bigwin")) {
            await this.setLocalSpinFromFile(spinType);
        } 
        if (this.useLocalData && this.localSpinData) {
            return { payload: this.localSpinData };
        }

        try {
            const response = await fetch(`${this.baseURL}/api/spin/${spinType}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.sessionToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bet }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                return { error: data.error || 'Spin request failed' };
            }
            
            return data;
        } catch (error) {
            console.error('Spin failed:', error);
            return { error: error.message || 'Network error' };
        }
    }
}

export const gameService = new GameService();