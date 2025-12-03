import React, { useState, useEffect } from 'react';
import { useScrollReset } from '../OverlayComponents/useScrollReset.js';
import styled, { keyframes } from 'styled-components';
import { useGameState } from '../../GameState/GameStateContext.js';
import BaseOverlay from '../BaseOverlay.js';
import BetControl from '../OverlayComponents/BetControl.js';
import { formatCurrency } from '../../currencyFormatter.js';
import { UIAssetsManager } from '../../UIAssetsManager.js';
import { Star, StarHalf } from "@phosphor-icons/react";

import {
  FlexContainer,
  Title,
  TabContainer,
  TabButton,
  CardGrid,
  FeatureCard,
  CardContent,
  CardTitle,
  CardDescription,
  Volatility,
  ButtonGroup,
  ActivateButton,
  SuccessButton,
  DangerButton
} from '../OverlayComponents/OverlayStyles.js';

const SymbolImage = styled.img`
  width: ${props => props.$size || '120px'};
  height: ${props => props.$size || '120px'};
  object-fit: contain;
`;

const pulseScaleAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
`;

const Cost = styled.div`
  color: rgb(251, 191, 36);
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 12px;
  animation: ${props => props.$isAnimating ? pulseScaleAnimation : 'none'} 0.4s ease-out;
`;

const TitleDivider = styled.div`
  height: 1px;
  background-color: rgba(181, 182, 238, 0.8);
  width: 85%;
  margin: 10px auto 10px auto;
`;

const VolatilityStars = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 8px;
`;

const StarIcon = styled(Star)`
  color: ${props => props.$filled ? 'rgb(245, 218, 155)' : 'rgb(156, 163, 175)'};
`;

const VolatilityRating = ({ rating }) => {
  const totalStars = 5;
  
  return (
    <VolatilityStars>
      <Volatility style={{ marginRight: '8px' }}>Volatility:</Volatility>
      {Array.from({ length: totalStars }, (_, index) => {
        // Full star
        if (index < Math.floor(rating)) {
          return (
            <StarIcon 
              key={index} 
              $filled={true} 
              weight="fill" 
              size={28}
            />
          );
        }
        // Half star
        else if (index === Math.floor(rating) && rating % 1 !== 0) {
          return (
            <StarHalf 
              key={index}
              color="rgb(245, 218, 155)"
              weight="fill"
              size={28}
            />
          );
        }
        // Empty star
        else {
          return (
            <StarIcon 
              key={index} 
              $filled={false} 
              weight="regular" 
              size={28}
            />
          );
        }
      })}
    </VolatilityStars>
  );
};

const FeatureCardComponent = ({ feature, cost, onClick, isConfirming, onConfirm, onCancel }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isConfirming) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isConfirming]);

  return (
    <FeatureCard>
      <CardContent>
        <CardTitle style={{ marginTop: 0, marginBottom: 0 }}>{feature.title}</CardTitle>
        <TitleDivider />
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Afficher la description seulement si elle existe */}
          {feature.description && <CardDescription>{feature.description}</CardDescription>}
          
          <SymbolImage 
            src={UIAssetsManager.getImageSrc(feature.image)} 
            alt={feature.title}
            $size={feature.imageSize} // Support de la taille configurable
          />
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <VolatilityRating rating={feature.volatility} />
          <Cost $isAnimating={isAnimating}>
            {formatCurrency(cost)}
          </Cost>

          {!isConfirming ? (
            <ActivateButton onClick={onClick}>
              ACTIVATE
            </ActivateButton>
          ) : (
            <ButtonGroup style={{ justifyContent: 'center' }}>
              <SuccessButton onClick={onConfirm}>YES</SuccessButton>
              <DangerButton onClick={onCancel}>NO</DangerButton>
            </ButtonGroup>
          )}
        </div>
      </CardContent>
    </FeatureCard>
  );
};

// Main Component
const FeatureOverlay = ({ onClose, onFeatureSelect }) => {
  const { currentBet, uiConfig } = useGameState();
  const [confirmingFeature, setConfirmingFeature] = useState(null);
  
  // Obtenir la configuration depuis uiConfig
  const featuresConfig = uiConfig?.features || {};
  const configuredTabs = featuresConfig.tabs || [];
  const configuredFeatures = featuresConfig.features || [];
  
  const tabs = configuredTabs.length > 0 ? configuredTabs : [];
  const enabledTabs = tabs.filter(tab => tab.enabled);
  
  const [activeTab, setActiveTab] = useState(enabledTabs[0]?.id || 'bigWins');

  useScrollReset(activeTab);

  // Grouper les features par tab
  const getFeaturesByTab = (tabId) => {
    return configuredFeatures.filter(feature => feature.tab === tabId);
  };

  // Calculer le coût d'une feature
  const calculateCost = (feature) => {
    return currentBet * feature.costMultiplier;
  };

  const handleFeatureClick = (featureId) => {
    setConfirmingFeature(featureId);
  };

  const handleConfirm = (featureId) => {
    onFeatureSelect(featureId);
    setConfirmingFeature(null);
    onClose();
  };

  const handleCancel = () => {
    setConfirmingFeature(null);
  };

  // Fonction pour rendre les cartes de fonctionnalités selon la catégorie active
  const renderFeatureCards = () => {
    const features = getFeaturesByTab(activeTab);
    
    if (features.length === 0) {
      return (
        <div style={{ textAlign: 'center', color: 'white', marginTop: '2rem' }}>
          No features configured for this tab.
        </div>
      );
    }
    
    return (
      <CardGrid $cards={features.length}>
        {features.map((feature) => (
          <FeatureCardComponent
            key={feature.id}
            feature={feature}
            cost={calculateCost(feature)}
            onClick={() => handleFeatureClick(feature.id)}
            isConfirming={confirmingFeature === feature.id}
            onConfirm={() => handleConfirm(feature.id)}
            onCancel={handleCancel}
          />
        ))}
      </CardGrid>
    );
  };

  // Trouver l'onglet actuel pour savoir s'il faut afficher le BetControl
  const currentTabConfig = enabledTabs.find(tab => tab.id === activeTab);

  return (
    <BaseOverlay onClose={onClose} contentType="feature">
      <FlexContainer>
        <Title>FEATURE BUY</Title>
        
        {/* Tab Container */}
        <TabContainer>
          {enabledTabs.map(tab => (
            <TabButton
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabContainer>
        
        {/* BetControl affiché selon la config de l'onglet */}
        {currentTabConfig?.showBetControl && <BetControl customLabel="BET" />}
        
        {/* Affichage des cartes de fonctionnalités selon l'onglet actif */}
        {renderFeatureCards()}
      </FlexContainer>
    </BaseOverlay>
  );
};

export default FeatureOverlay;