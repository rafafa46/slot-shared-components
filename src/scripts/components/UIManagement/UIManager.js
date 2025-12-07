import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import styled, { createGlobalStyle } from 'styled-components';
import { soundManager } from "../../utils/SoundManager.js";
import { FullscreenHelper } from "../../utils/FullscreenHelper.js";
import { GameStateManager } from './GameState/GameStateManager.js';
import { GameStateProvider } from './GameState/GameStateContext.js';
import { OverlayProvider, useOverlay } from './Overlay/OverlayContext.js';
import OverlayManager from './Overlay/OverlayManager.js';
import MenuContainer from './Menu/MenuContainer.js';

const GlobalDragDisableStyles = createGlobalStyle`
  img {
    -webkit-user-drag: none;
    user-drag: none;
  }
`;

export class UIManager {
    constructor(app) {
        this.app = app;
        this.stateManager = new GameStateManager(this.app.config.ui);
        this.version = 'desktop';
        this.root = null;
        this.container = null;
        this.updateVersion = null;
        this.startGame = null;
        this.currentLoadingProgress = 0;
    }

    initialize() {
        return new Promise((resolve) => {
            this.container = document.createElement('div');
            this.container.style.pointerEvents = 'none';
            document.body.appendChild(this.container);
            this.root = ReactDOM.createRoot(this.container);
            
            const UIRoot = () => {
                const { showOverlay, hideOverlay } = useOverlay();
                const [isGameStarted, setIsGameStarted] = useState(false);
                const [version, setVersion] = useState(this.version);
                
                React.useEffect(() => {
                    this.showOverlay = showOverlay;
                    this.hideOverlay = hideOverlay;

                    this.startGame = () => setIsGameStarted(true);
                    this.updateVersion = (newVersion) => setVersion(newVersion);
                    
                    resolve();
                }, []);
            
                return (
                    <>
                        <GlobalDragDisableStyles />
                        
                        <GameStateProvider 
                          stateManager={this.stateManager} 
                          uiConfig={this.app.config.ui}
                        >
                            <OverlayManager />
                            {isGameStarted && (
                                <MenuContainer 
                                    version={version}
                                    onBuyFeatureClick={this.showFeatureOverlay}
                                    onMenuClick={this.showMenuOverlay}
                                />
                            )}
                        </GameStateProvider>
                    </>
                );
            };

            this.root.render(
                <OverlayProvider>
                    <UIRoot />
                </OverlayProvider>
            );
        });
    }

    resize(scale, paddingX, paddingY) {
        if (this.container) {
            this.container.style.position = 'absolute';
            this.container.style.transformOrigin = 'top left';
            this.container.style.transform = `scale(${scale})`;
            this.container.style.left = `${paddingX}px`;
            this.container.style.top = `${paddingY}px`;
            this.container.style.width = `${this.app.maxGameWidth}px`;
            this.container.style.height = `${this.app.maxGameHeight}px`;
        }
    }

    showStartOverlay() {
        this.showOverlay?.('START_GAME', {
            onStart: () => this.handleStartGame()
        });
    }

    updateLayout(layoutConfig) {
        this.version = layoutConfig.version;
        if (this.updateVersion) {
            this.updateVersion(this.version);
        }
    }

    async handleStartGame() {
        const isMobile = !this.app.gameVersionManager.isDesktop();

        if (isMobile && FullscreenHelper.isFullscreenSupported()) {
            await FullscreenHelper.requestFullscreen();
        }
    
        this.hideOverlay();
        this.launchSoundManager();
        this.startGame();
    }

    showBonusOverlay() {
        return new Promise((resolve) => {
            if (this.stateManager.isAutoplayActive && this.stateManager.stopOnBonusWin) {
                this.stateManager.toggleAutoplay();
            }

            this.showOverlay?.('BONUS_WIN', {
                onStart: () => {
                    this.hideOverlay();
                    resolve();
                }
            });
        });
    }

    showFeatureOverlay = () => {
        this.showOverlay('FEATURE_BUY', {
            onFeatureSelect: (featureId, jsonFile = null) => {
                this.stateManager.activateFeature(featureId, jsonFile);
                this.hideOverlay();
            }
        });
    }

    showMenuOverlay = () => {
        this.showOverlay('GAME_MENU');
    }

    showMessage(title, message, type = 'info') {
        this.showOverlay?.('MESSAGE', { title, message, type });
    }

    showLoadingOverlay() {
        this.currentLoadingProgress = 0;
        this.showOverlay?.('LOADING', {
          progress: 0
        });
    }
    
    updateLoadingProgress(progress) {
        this.currentLoadingProgress = progress;
        
        if (this.showOverlay) {
            this.showOverlay('LOADING', {
                progress: progress
            });
        }
    }

    hideOverlay() {
        this.hideOverlay?.();
    }

    handleFullscreenChange() {
        // Forcer un resize pour s'assurer que tout s'affiche correctement: à supprimer?
        if (this.app && this.app.resize) {
            this.app.resize();
        }
    }

    launchSoundManager() {
        soundManager.initialize();
        soundManager.setBackgroundMusic();
        soundManager.playBackgroundMusic();
        soundManager.setAmbientSound();
        soundManager.playAmbientSound();
    }

    destroy() {
        if (this.root) {
            this.root.unmount();
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

}