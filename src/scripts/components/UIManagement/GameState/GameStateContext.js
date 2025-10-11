import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { updateGameStateSnapshot } from '../../../utils/GameStateBridge.js';

const GameStateContext = createContext();

export const GameStateProvider = ({ children, stateManager, uiConfig }) => {
    const [, forceUpdate] = React.useState({});

    useEffect(() => {
        stateManager.onStateChange = () => forceUpdate({});
        return () => {
            stateManager.onStateChange = null;
        };
    }, [stateManager]);

    useEffect(() => {
        updateGameStateSnapshot({
            turboMode: stateManager.turboMode
        });
    }, [stateManager.turboMode]);

    // Déclarer tous les callbacks avant useMemo
    const changeBet = useCallback((direction) => 
        stateManager.changeBet(direction), [stateManager]);
    
    const toggleAutoplay = useCallback(() => 
        stateManager.toggleAutoplay(), [stateManager]);
    
    const updateTurboMode = useCallback(() => 
        stateManager.updateTurboMode(), [stateManager]);
    
    const launchSpin = useCallback(() => 
        stateManager.launchSpin(), [stateManager]);

    const requestSpeedUp = useCallback(() => 
        stateManager.requestSpeedUp(), [stateManager]);

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
        bonusSpinsRemaining: stateManager.bonusSpinsRemaining,
        turboMode: stateManager.turboMode,
        isAutoplayActive: stateManager.isAutoplayActive,
        activeFeature: stateManager.activeFeature,
        isSpinIcon: stateManager.isSpinIcon,
        speedUpRequested: stateManager.speedUpRequested,
        isAnimating: stateManager.isAnimating,
        isSpinStarting: stateManager.isSpinStarting,
        musicVolume: stateManager.musicVolume,
        soundVolume: stateManager.soundVolume,
        uiConfig,
        changeBet,
        toggleAutoplay,
        updateTurboMode,
        launchSpin,
        requestSpeedUp,
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
        stateManager.bonusSpinsRemaining,
        stateManager.turboMode,
        stateManager.isAutoplayActive,
        stateManager.activeFeature,
        stateManager.isSpinIcon,
        stateManager.speedUpRequested,
        stateManager.isAnimating,
        stateManager.isSpinStarting,
        stateManager.musicVolume,
        stateManager.soundVolume,
        uiConfig,
        changeBet,
        toggleAutoplay,
        updateTurboMode,
        launchSpin,
        requestSpeedUp,
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