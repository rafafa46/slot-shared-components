import React from 'react';
import BaseOverlay from '../BaseOverlay.js';
import { useGameState } from '../../GameState/GameStateContext.js';
import {
  FlexContainer,
  Title,
  Text,
  AnimatedText
} from '../OverlayComponents/OverlayStyles.js';

const BonusWinOverlay = ({ onStart }) => {
  const { uiConfig } = useGameState();
  
  // Obtenir la config depuis uiConfig avec fallback
  const overlayConfig = uiConfig?.overlay?.BONUS_WIN?.props || {};
  const title = overlayConfig.title || 'Bonus Round Activated!';
  const text = overlayConfig.text || 'You won a bonus round!';

  return (
    <BaseOverlay
      overlayType="clickable"
      contentType="bonus"
      onAction={onStart}
    >
      <FlexContainer $gap="2rem" $maxWidth="32rem">
        <Title>{title}</Title>
        {/* Support du HTML dans le texte */}
        <Text dangerouslySetInnerHTML={{ __html: text }} />
        <AnimatedText>TAP TO START</AnimatedText>
      </FlexContainer>
    </BaseOverlay>
  );
};

export default BonusWinOverlay;