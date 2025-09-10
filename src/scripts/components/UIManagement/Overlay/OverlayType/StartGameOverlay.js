import React from 'react';
import styled from 'styled-components';
import BaseOverlay from '../BaseOverlay.js';
import { UIAssetsManager } from '../../UIAssetsManager.js';
import {
  FlexContainer,
  Title,
  Text,
  AnimatedText
} from '../OverlayComponents/OverlayStyles.js';

const SymbolsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 1rem 0;
  flex-wrap: wrap; /* Permet le retour à la ligne */
`;

const SymbolImage = styled.img`
  width: 80px;  /* ✅ Plus petit et raisonnable */
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.4));
`;

const StartGameOverlay = ({ onStart }) => (
  <BaseOverlay
    overlayType="clickable"
    contentType="start"
    onAction={onStart}
  >
    <FlexContainer>
      <SymbolsRow>
        <SymbolImage 
          src={UIAssetsManager.getImageSrc('symbols-Knight')}
          alt="Knight Symbol"
        />
        <SymbolImage 
          src={UIAssetsManager.getImageSrc('symbols-King')}
          alt="King Symbol"
        />
        <SymbolImage 
          src={UIAssetsManager.getImageSrc('symbols-Queen')}
          alt="Queen Symbol"
        />
        <SymbolImage 
          src={UIAssetsManager.getImageSrc('symbols-Wizard')}
          alt="Wizard Symbol"
        />
        <SymbolImage 
          src={UIAssetsManager.getImageSrc('symbols-Hero')}
          alt="Hero Symbol"
        />
      </SymbolsRow>

      {}
      <Title>Welcome to Crown Quest!</Title>
      <Text>Click anywhere to start playing</Text>
      <AnimatedText>TAP TO START</AnimatedText>
    </FlexContainer>
  </BaseOverlay>
);

export default StartGameOverlay;