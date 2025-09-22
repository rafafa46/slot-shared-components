export class Tools {

    static randomInteger(min, max) {
        const range = max - min + 1;

        const maxUint32 = 4294967295; // 2^32 - 1
        const limit = maxUint32 - (maxUint32 % range);

        let x;
        do {
            x = new Uint32Array(1);
            crypto.getRandomValues(x);
        } while (x[0] > limit);

        return min + (x[0] % range);
    }

    static randomBoolean(probability) {
         // Utilise 20 bits de précision pour la probabilité
        const precision = 1048576; // 2^20
        const threshold = Math.floor(probability * precision);

        return Tools.randomInteger(0, precision - 1) < threshold;
    }

    static getRandomWeightedElement(elements) {
        
        const totalWeight = elements.reduce((sum, item) => sum + item.weight, 0);
        const randomValue = Tools.randomInteger(1, totalWeight);

        let cumulativeWeight = 0;
        for (const item of elements) {
            cumulativeWeight+= item.weight;
            if (randomValue <= cumulativeWeight) {
                return item;
            }
        }

        // Erreur critique : impossible de sélectionner un symbole pondéré
        throw new Error(`Erreur critique dans getRandomWeightedSymbol: impossible de sélectionner un symbole. TotalWeight: ${totalWeight}, RandomValue: ${randomValue}, PossibleSymbols: ${JSON.stringify(elements)}`);
    }

    static uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
          (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }

}
