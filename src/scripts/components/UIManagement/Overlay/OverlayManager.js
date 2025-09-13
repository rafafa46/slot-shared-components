import React from 'react';
import { useOverlay } from './OverlayContext.js';
import StartGameOverlay from './OverlayType/StartGameOverlay.js';
import BonusWinOverlay from './OverlayType/BonusWinOverlay.js';
import MessageOverlay from './OverlayType/MessageOverlay.js';
import FeatureOverlay from './OverlayType/FeatureOverlay.js';
import MenuOverlay from './OverlayType/MenuOverlay.js';
import LoadingOverlay from './OverlayType/LoadingOverlay.js';

const OVERLAY_COMPONENTS = {
  START_GAME: (props) => <StartGameOverlay {...props} />,
  BONUS_WIN: (props) => <BonusWinOverlay {...props} />,
  MESSAGE: (props) => <MessageOverlay {...props} />,
  FEATURE_BUY: (props) => <FeatureOverlay {...props} />,
  GAME_MENU: (props) => <MenuOverlay {...props} />,
  LOADING: (props) => <LoadingOverlay {...props} />
};

const OverlayManager = () => {
    const { isVisible, type, props, hideOverlay } = useOverlay();
    const { uiConfig } = useGameState();
  
    if (!isVisible || !type) return null;

    // Vérifier si l'overlay est autorisé dans la configuration
    const overlayConfig = uiConfig.overlays || {};
    if (!overlayConfig[type]) {
      console.warn(`Overlay ${type} is not configured and will not be displayed`);
      return null;
    }
  
    const OverlayComponent = OVERLAY_COMPONENTS[type];
    if (!OverlayComponent) return null;

    if (type === 'LOADING') {
      return <OverlayComponent {...props} />;
    }
  
    return <OverlayComponent {...props} onClose={hideOverlay} />;
};


export default OverlayManager;