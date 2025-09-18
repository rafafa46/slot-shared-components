import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTouchButton } from './UseTouchButton.js';
import { getMenuStyles } from './Styles/MenuStyles.js';
import { useGameState } from '../GameState/GameStateContext.js';
import { formatCurrency } from '../currencyFormatter.js';
import { UIAssetsManager } from '../UIAssetsManager.js';
import { soundManager } from '../../../utils/SoundManager.js';
import { gsap } from 'gsap';

const Menu = ({ 
  version = 'desktop', 
  onBuyFeatureClick, 
  onMenuClick,
}) => {
  const {
    displayedBet,
    balance,
    winAmount,
    turboMode,
    isAutoplayActive,
    activeFeature,
    isSpinIcon,
    requestSpeedUp,
    changeBet,
    toggleAutoplay,
    updateTurboMode,
    launchSpin,
    deactivateFeature,
    isButtonDisabled
  } = useGameState();

  const {
    MenuContainer,
    MenuBar,
    BuyFeatureButton,
    MenuButton,
    BalanceContainer,
    WinContainer,
    BalanceLabel,
    BalanceAmount,
    WinLabel,
    WinAmount,
    TurboButton,
    SpinButton,
    SpinIconContainer,
    SpinIcon,
    AutoplayButton,
    BetControl,
    BetLabel,
    BetValues,
    BetButton,
    BetDisplay,
  } = getMenuStyles(version);

  const { getTouchProps, getTouchPropsForRepeating } = useTouchButton();

  const intervalRef = useRef(null);
  const spinIconRef = useRef(null);
  const [isSpacebarPressed, setIsSpacebarPressed] = useState(false);

  const buttonAssets = {
    spin: {
      bigCircle: UIAssetsManager.getImageSrc('ui-spin-circle-big'),
      smallCircle: UIAssetsManager.getImageSrc('ui-spin-circle-small'),
      spinIcon: isSpinIcon
        ? UIAssetsManager.getImageSrc('ui-spin')
        : UIAssetsManager.getImageSrc('ui-spin-skip'),
    },
    turbo: {
      background: UIAssetsManager.getImageSrc('ui-circle-small'),
      icon: turboMode === 'superTurbo' 
        ? UIAssetsManager.getImageSrc('ui-turbo-double-sharp')
        : UIAssetsManager.getImageSrc('ui-turbo-sharp'),
    },
    autoplay: {
      background: UIAssetsManager.getImageSrc('ui-circle-small'),
      icon: isAutoplayActive
        ? UIAssetsManager.getImageSrc('ui-autoplay-stop-sharp')
        : UIAssetsManager.getImageSrc('ui-autoplay-start-sharp'),
    },
    betMinus: {
      background: UIAssetsManager.getImageSrc('ui-hoop'),
      icon: UIAssetsManager.getImageSrc('ui-minus'),
    },
    betPlus: {
      background: UIAssetsManager.getImageSrc('ui-hoop'),
      icon: UIAssetsManager.getImageSrc('ui-plus'),
    },
    buyFeature: {
      background: UIAssetsManager.getImageSrc('ui-circle-big'),
    },
    menu: {
      icon: UIAssetsManager.getImageSrc('ui-menu'),
    }
  };

  const handleBetChange = useCallback((direction) => {
    if (!isButtonDisabled('betChange')) {
      changeBet(direction);
    }
  }, [changeBet, isButtonDisabled]);

  const startRepeatingChange = useCallback((direction, event) => {
    // Pour les événements tactiles, event.button n'existe pas
    if (event.button !== undefined && event.button !== 0) return;
    if (isButtonDisabled('betChange')) return;

    const change = () => {
      changeBet(direction);
    };

    change();
    intervalRef.current = setInterval(change, 220);
  }, [changeBet, isButtonDisabled]);

  const stopRepeatingChange = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleBuyFeatureClick = () => {
    if (activeFeature) {
      deactivateFeature();
    } else {
      onBuyFeatureClick();
    }
  };

  const handleSpin = () => {
    if (isButtonDisabled('spin')) return;
        
    if (!isSpinIcon) {
        // Si on affiche skip, faire un speed up
        requestSpeedUp();
    } else {
        soundManager.playSound('click');
        // Sinon, lancer un nouveau spin
        launchSpin();

        const durations = {
          superTurbo: 0.6,
          turbo: 0.8,
          normal: 1,
        };

        const duration = durations[turboMode];
        
        if (spinIconRef.current) {   
            gsap.to(spinIconRef.current, {
                rotation: 720,
                duration: duration,
                ease: "power1.out",
                onComplete: () => {
                    gsap.set(spinIconRef.current, { rotation: 0 });
                }
            });
        }
    }
};

  // Gestion de la barre d'espace
  const handleKeyDown = useCallback((event) => {
    if (event.code === 'Space' && !event.repeat && !isButtonDisabled('spin')) {
      event.preventDefault();
      setIsSpacebarPressed(true);
      handleSpin();
    }
  }, [isButtonDisabled, handleSpin]);

  const handleKeyUp = useCallback((event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      setIsSpacebarPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <MenuContainer>
      <MenuBar />
      <MenuButton 
        onClick={onMenuClick}
        {...getTouchProps(onMenuClick)}
        $bgImage={buttonAssets.menu.icon}
      >
      </MenuButton>

      <BuyFeatureButton 
        onClick={handleBuyFeatureClick}
        {...getTouchProps(handleBuyFeatureClick)}
        disabled={isButtonDisabled('buyFeature')}
        $isFeatureActive={!!activeFeature}
        $bgImage={buttonAssets.buyFeature.background}
      >
        {activeFeature ? 'DISABLE' : 'Features + BigWin demos'}
      </BuyFeatureButton>

      <SpinButton 
        onClick={handleSpin} 
        {...getTouchProps(handleSpin)}
        disabled={isButtonDisabled('spin')}
        $isFeatureActive={!!activeFeature}
        $bgImageBig={buttonAssets.spin.bigCircle}
        $bgImageSmall={buttonAssets.spin.smallCircle}
      >
        <SpinIconContainer $isFeatureActive={!!activeFeature}>
          <SpinIcon 
            ref={spinIconRef} 
            $bgImageSpin={buttonAssets.spin.spinIcon}
            $isFeatureActive={!!activeFeature}
          />
        </SpinIconContainer>
      </SpinButton>

      <TurboButton 
        onClick={updateTurboMode}
        {...getTouchProps(updateTurboMode)}
        $turboMode={turboMode}
        $bgImage={buttonAssets.turbo.background}
        $iconImage={buttonAssets.turbo.icon}
      >
      </TurboButton>

      <AutoplayButton 
        onClick={toggleAutoplay}
        {...getTouchProps(toggleAutoplay)}
        $active={isAutoplayActive} 
        disabled={isButtonDisabled('autoplay')}
        $bgImage={buttonAssets.autoplay.background}
        $iconImage={buttonAssets.autoplay.icon}
      >
      </AutoplayButton>

      <BalanceContainer>
        <BalanceLabel>DEMO BALANCE</BalanceLabel>
        <BalanceAmount>{formatCurrency(balance)}</BalanceAmount>
      </BalanceContainer>

      <WinContainer style={{ opacity: winAmount !== null ? 1 : 0 }}>
        <WinLabel>WIN</WinLabel>
        <WinAmount>{winAmount !== null ? `${formatCurrency(winAmount)}` : ''}</WinAmount>
      </WinContainer>

      <BetControl>
        <BetButton 
          $isFeatureActive={!!activeFeature}
          onMouseDown={(e) => startRepeatingChange('down', e)}
          onMouseUp={stopRepeatingChange}
          onMouseLeave={stopRepeatingChange}
          {...getTouchPropsForRepeating(
            (e) => startRepeatingChange('down', e),
            stopRepeatingChange
          )}
          onContextMenu={(e) => e.preventDefault()}
          disabled={isButtonDisabled('betChange')}
          $bgImage={buttonAssets.betMinus.background}
          $iconImage={buttonAssets.betMinus.icon}
        >
        </BetButton>
        
        <BetValues>
          <BetLabel $isFeatureActive={!!activeFeature}>DEMO BET</BetLabel>
          <BetDisplay $isFeatureActive={!!activeFeature}>
              {formatCurrency(displayedBet)}
          </BetDisplay>
        </BetValues>
        
        <BetButton 
          $isFeatureActive={!!activeFeature}
          onMouseDown={(e) => startRepeatingChange('up', e)}
          onMouseUp={stopRepeatingChange}
          onMouseLeave={stopRepeatingChange}
          {...getTouchPropsForRepeating(
            (e) => startRepeatingChange('up', e),
            stopRepeatingChange
          )}
          onContextMenu={(e) => e.preventDefault()}
          disabled={isButtonDisabled('betChange')}
          $bgImage={buttonAssets.betPlus.background}
          $iconImage={buttonAssets.betPlus.icon}
        >
        </BetButton>
      </BetControl>
    </MenuContainer>
  );
};

export default React.memo(Menu);