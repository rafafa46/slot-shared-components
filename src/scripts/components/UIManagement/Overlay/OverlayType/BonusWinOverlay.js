import React from 'react';
import styled from 'styled-components';
import BaseOverlay from '../BaseOverlay.js';
import { UIAssetsManager } from '../../UIAssetsManager.js';

import {
  FlexContainer,
  StyledImage,
  BlurBackground,
  Title,
  Text,
  AnimatedText
} from '../OverlayComponents/OverlayStyles.js';

// Container pour les 3 images scatter
const ScatterRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
`;

// Container pour chaque image scatter
const ScatterImageContainer = styled.div`
  width: 8rem;
  height: 8rem;
  position: relative;
  
  @media (max-width: 768px) {
    width: 6rem;
    height: 6rem;
  }
`;

// Titre réduit et rapproché
const LargeTitle = styled(Title)`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Texte d'explication sans cadre et police réduite
const ExplanationText = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.6;
  margin: 1rem 0;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0.8rem 0;
  }
`;

// Texte réduit
const LargeText = styled(Text)`
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

// Texte animé réduit
const LargeAnimatedText = styled(AnimatedText)`
  font-size: 1rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BonusWinOverlay = ({ onStart }) => (
  <BaseOverlay
    overlayType="clickable"
    contentType="bonus"
    onAction={onStart}
  >
    <FlexContainer $gap="1.5rem" $maxWidth="40rem">
      <ScatterRow>
        <ScatterImageContainer>
          <StyledImage 
            src={UIAssetsManager.getImageSrc('symbols-Scatter')}
            alt="bonus item 1" 
          />
          <BlurBackground $color="rgba(59, 130, 246, 0.3)" />
        </ScatterImageContainer>
        <ScatterImageContainer>
          <StyledImage 
            src={UIAssetsManager.getImageSrc('symbols-Scatter')}
            alt="bonus item 2" 
          />
          <BlurBackground $color="rgba(59, 130, 246, 0.3)" />
        </ScatterImageContainer>
        <ScatterImageContainer>
          <StyledImage 
            src={UIAssetsManager.getImageSrc('symbols-Scatter')}
            alt="bonus item 3" 
          />
          <BlurBackground $color="rgba(59, 130, 246, 0.3)" />
        </ScatterImageContainer>
      </ScatterRow>
      
      <LargeTitle>
        Bonus Round Activated!
      </LargeTitle>
      
      <ExplanationText>
        <strong>You won 8 free spins!</strong><br/><br/>
        Symbol panel upgrades and wilds are permanent throughout the bonus.<br/>
        If at least one special symbol lands during a spin, you win an additional free spin!
      </ExplanationText>
      
      <LargeText>
        Click anywhere to start playing
      </LargeText>
      
      <LargeAnimatedText>
        TAP TO START
      </LargeAnimatedText>
    </FlexContainer>
  </BaseOverlay>
);

export default BonusWinOverlay;