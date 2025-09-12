import React from 'react';
import BaseOverlay from '../BaseOverlay.js';
import { useGameState } from '../../GameState/GameStateContext.js';
import {
  FlexContainer,
  Title,
  Text,
  AnimatedText
} from '../OverlayComponents/OverlayStyles.js';

const StartGameOverlay = ({ onStart }) => {
  const { uiConfig } = useGameState();
  
  // Obtenir la config depuis uiConfig avec fallback
  const overlayConfig = uiConfig?.overlay?.START_GAME?.props || {};
  const title = overlayConfig.title || 'Welcome to the Game!';
  const text = overlayConfig.text || 'Click anywhere to start playing';

  return (
    <BaseOverlay
      overlayType="clickable"
      contentType="start"
      onAction={onStart}
    >
      <FlexContainer>
        <Title>{title}</Title>
        <Text>{text}</Text>
        <AnimatedText>TAP TO START</AnimatedText>
      </FlexContainer>
    </BaseOverlay>
  );
};

export default StartGameOverlay;