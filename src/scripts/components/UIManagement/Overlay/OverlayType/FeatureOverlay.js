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
  width: 120px;
  height: 120px;
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
  font-size: 1.5rem;
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
              size={20}
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
              size={20}
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
              size={20}
            />
          );
        }
      })}
    </VolatilityStars>
  );
};

const FeatureCardComponent = ({ title, description, image, cost, volatility, onClick, isConfirming, onConfirm, onCancel }) => {
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
        <CardTitle style={{ marginTop: 0, marginBottom: 0 }}>{title}</CardTitle>
        <TitleDivider />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardDescription>{description}</CardDescription>
          <SymbolImage src={image}/>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <VolatilityRating rating={volatility} />
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
  const { currentBet } = useGameState();
  const [confirmingFeature, setConfirmingFeature] = useState(null);
  const [activeTab, setActiveTab] = useState('bigWins');
  
  // Définition des fonctionnalités par catégorie
  const featureCategories = {
    bigWins: [
      {
        id: 'bigwin_baseGame_100',
        title: 'Base Game x100',
        image: UIAssetsManager.getImageSrc('symbols-special_wild'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_baseGame_200',
        title: 'Base Game x200',
        image: UIAssetsManager.getImageSrc('symbols-special_wild'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_baseGame_500',
        title: 'Base Game x500',
        image: UIAssetsManager.getImageSrc('symbols-special_wild'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_baseGame_1000',
        title: 'Base Game x1000',
        image: UIAssetsManager.getImageSrc('symbols-special_wild'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_bonus_1000',
        title: 'Bonus x1000',
        image: UIAssetsManager.getImageSrc('symbols-special_remove'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_bonus_2000',
        title: 'Bonus x2000',
        image: UIAssetsManager.getImageSrc('symbols-special_remove'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_bonus_3000',
        title: 'Bonus x3000',
        image: UIAssetsManager.getImageSrc('symbols-special_remove'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_bonus_5000',
        title: 'Bonus x5000',
        image: UIAssetsManager.getImageSrc('symbols-special_remove'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_superbonus_2000',
        title: 'Super Bonus x2000',
        image: UIAssetsManager.getImageSrc('symbols-special_multi'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_superbonus_5000',
        title: 'Super Bonus x5000',
        image: UIAssetsManager.getImageSrc('symbols-special_multi'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_superbonus_10000_1',
        title: 'Super Bonus x10000',
        image: UIAssetsManager.getImageSrc('symbols-special_multi'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_superbonus_10000_2',
        title: 'Super Bonus x10000',
        image: UIAssetsManager.getImageSrc('symbols-special_multi'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_superbonus_10000_3',
        title: 'Super Bonus x10000',
        image: UIAssetsManager.getImageSrc('symbols-special_crown'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_superbonus_10000_4',
        title: 'Super Bonus x10000',
        image: UIAssetsManager.getImageSrc('symbols-special_crown'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_superbonus_10000_5',
        title: 'Super Bonus x10000',
        image: UIAssetsManager.getImageSrc('symbols-special_crown'),
        cost: 1,
        volatility: 0,
      },
      {
        id: 'bigwin_superbonus_10000_6',
        title: 'Super Bonus x10000',
        image: UIAssetsManager.getImageSrc('symbols-special_crown'),
        cost: 1,
        volatility: 0,
      },
    ],
    bonusHunt: [
      {
        id: 'quintupleChance',
        title: 'QUINTUPLE CHANCE',
        description: 'Each spin is 5 times more likely to trigger a Bonus Game!',
        image: UIAssetsManager.getImageSrc('symbols-Scatter'),
        //cost: currentBet * UI_CONFIG.featureCost.quintupleChance,
        cost: 1,
        volatility: 4
      }
    ],
    feature: [
      {
        id: 'superSpin',
        title: 'SUPER SPIN',
        description: 'Each spin guarantees that at least 1 special symbol land, 3 times in a row!',
        image: UIAssetsManager.getImageSrc('symbols-special_remove'),
        //cost: currentBet * UI_CONFIG.featureCost.superSpin,
        cost: 1,
        volatility: 4
      }
    ],
    bonus: [
      {
        id: 'bonus',
        title: 'BONUS GAME',
        description: '8 free Spins with permanent wilds and upgrades in symbol panel!',
        image: UIAssetsManager.getImageSrc('symbols-special_multi'),
        //cost: currentBet * UI_CONFIG.featureCost.bonus,
        cost: 1,
        volatility: 4
      },
      {
        id: 'superBonus',
        title: 'SUPER BONUS GAME',
        description: '8 free Spins with permanent upgrades, the chances of getting crowns are increased !',
        image: UIAssetsManager.getImageSrc('symbols-special_crown'),
        //cost: currentBet * UI_CONFIG.featureCost.superBonus,
        cost: 1,
        volatility: 4.5
      }
    ]
  };

  useScrollReset(activeTab);

  const tabs = [
    { id: 'bigWins', label: 'BIG WINS' },
    { id: 'bonusHunt', label: 'BONUS HUNT' },
    { id: 'feature', label: 'FEATURE' },
    { id: 'bonus', label: 'BONUS' }
  ];

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
    const features = featureCategories[activeTab] || [];
    
    return (
      <CardGrid $cards={features.length}>
        {features.map((feature) => (
          <FeatureCardComponent
            key={feature.id}
            title={feature.title}
            description={feature.description}
            image={feature.image}
            cost={feature.cost}
            volatility={feature.volatility}
            onClick={() => handleFeatureClick(feature.id)}
            isConfirming={confirmingFeature === feature.id}
            onConfirm={() => handleConfirm(feature.id)}
            onCancel={handleCancel}
          />
        ))}
      </CardGrid>
    );
  };

  return (
    <BaseOverlay onClose={onClose} contentType="feature">
      <FlexContainer>
        <Title>FEATURE BUY</Title>
        
        {/* Tab Container */}
        <TabContainer>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabContainer>
        
        {/* BetControl affiché dans chaque onglet sauf bigWins */}
        {activeTab !== 'bigWins' && <BetControl customLabel="BET" />}
        
        {/* Affichage des cartes de fonctionnalités selon l'onglet actif */}
        {renderFeatureCards()}
      </FlexContainer>
    </BaseOverlay>
  );
};

export default FeatureOverlay;