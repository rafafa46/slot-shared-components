import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { updateGameStateSnapshot } from '../../../utils/GameStateBridge.js';

const GameStateContext = createContext();

export const GameStateProvider = ({ children, stateManager, uiconfig }) => {
    const [, forceUpdate] = React.useState({});

    useEffect(() => {
        stateManager.onStateChange = () => forceUpdate({});
        return () => {
            stateManager.onStateChange = null;
        };
    }, [stateManager]);

    useEffect(() => {
        updateGameStateSnapshot({
            isTurboActive: stateManager.isTurboActive
        });
    }, [stateManager.isTurboActive]);

    // Déclarer tous les callbacks avant useMemo
    const changeBet = useCallback((direction) => 
        stateManager.changeBet(direction), [stateManager]);
    
    const toggleAutoplay = useCallback(() => 
        stateManager.toggleAutoplay(), [stateManager]);
    
    const toggleTurbo = useCallback(() => 
        stateManager.toggleTurbo(), [stateManager]);
    
    const launchSpin = useCallback(() => 
        stateManager.launchSpin(), [stateManager]);

    const deactivateFeature = useCallback(() => 
        stateManager.deactivateFeature(), [stateManager]);
    
    const isButtonDisabled = useCallback((buttonType) => 
        stateManager.isButtonDisabled(buttonType), [stateManager]);

    const setMusicVolume = useCallback((volume) => 
        stateManager.setMusicVolume(volume), [stateManager]);
        
    const setSoundVolume = useCallback((volume) => 
        stateManager.setSoundVolume(volume), [stateManager]);

    const value = React.useMemo(() => ({
        stateManager,
        currentBet: stateManager.currentBet,
        displayedBet: stateManager.displayedBet,
        balance: stateManager.balance,
        winAmount: stateManager.winAmount,
        isTurboActive: stateManager.isTurboActive,
        isAutoplayActive: stateManager.isAutoplayActive,
        activeFeature: stateManager.activeFeature,
        isAnimating: stateManager.isAnimating,
        musicVolume: stateManager.musicVolume,
        soundVolume: stateManager.soundVolume,
        uiconfig,
        changeBet,
        toggleAutoplay,
        toggleTurbo,
        launchSpin,
        deactivateFeature,
        isButtonDisabled,
        setMusicVolume,
        setSoundVolume
    }), [
        stateManager,
        stateManager.currentBet,
        stateManager.displayedBet,
        stateManager.balance,
        stateManager.winAmount,
        stateManager.isTurboActive,
        stateManager.isAutoplayActive,
        stateManager.activeFeature,
        stateManager.isAnimating,
        stateManager.musicVolume,
        stateManager.soundVolume,
        uiconfig,
        changeBet,
        toggleAutoplay,
        toggleTurbo,
        launchSpin,
        deactivateFeature,
        isButtonDisabled,
        setMusicVolume,
        setSoundVolume
    ]);

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
};

export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
};