let gameStateSnapshot = {
    turboMode: 'normal'
};

export const updateGameStateSnapshot = (state) => {
    gameStateSnapshot = {
    ...gameStateSnapshot,
    turboMode: state.turboMode
    };
};

export const getGameStateSnapshot = () => gameStateSnapshot;