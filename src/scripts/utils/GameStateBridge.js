let gameStateSnapshot = {
    isTurboActive: false
};

export const updateGameStateSnapshot = (state) => {
    gameStateSnapshot = {
    ...gameStateSnapshot,
    isTurboActive: state.isTurboActive
    };
};

export const getGameStateSnapshot = () => gameStateSnapshot;