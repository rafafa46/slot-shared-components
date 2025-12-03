import React from 'react';
import styled from 'styled-components';
import { UIAssetsManager } from '../../../UIAssetsManager.js';
import { useGameState } from '../../../GameState/GameStateContext.js';
import { formatCurrency } from '../../../currencyFormatter.js';
import {
  Text,
  PayTableSection,
  SectionTitle,
  SymbolCard,
  SymbolInfo
} from '../OverlayStyles.js';

export const PayTableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 5}, max-content);
  gap: ${props => props.$gap || '20px'};
  justify-content: center;
  width: 100%;
  margin-bottom: 32px;
`;

const SymbolImage = styled.img`
  width: ${props => props.$size || '100px'};
  height: ${props => props.$size || '100px'};
  object-fit: contain;
  margin-bottom: 12px;
`;

const ItalicText = styled(Text)`
  font-style: italic;
  margin-bottom: 15px;
`;

const PayTableContent = () => {
  const { currentBet, uiConfig } = useGameState();

  const calculatePayout = (value) => {
    const rawValue = parseFloat(value);
    const multipliedValue = formatCurrency(rawValue * currentBet);
    return multipliedValue;
  };

  const renderPayouts = (payouts) => {
    return payouts.map((payout, index) => (
      <div key={index} style={{ margin: '8px 0' }}>
        <span style={{ color: '#FFC107', fontWeight: 'bold', fontSize: '1.4rem' }}>{payout[0]}</span>
        <span style={{ marginLeft: '20px', color: 'white', fontSize: '1.4rem' }}>
          {calculatePayout(payout[1])}
        </span>
      </div>
    ));
  };

  const renderSymbols = (symbols, imageSize) => {
    return symbols.map((symbol, index) => (
      <SymbolCard key={index}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <SymbolImage 
            src={UIAssetsManager.getImageSrc(symbol.image)}
            alt={symbol.name}
            $size={imageSize}
          />
          <SymbolInfo>
            {symbol.payouts ? (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                {renderPayouts(symbol.payouts)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '10px', color: 'white' }}>
                {symbol.description}
              </div>
            )}
          </SymbolInfo>
        </div>
      </SymbolCard>
    ));
  };

  const getColumnsForSection = (sectionId) => {
    switch (sectionId) {
      case 'specialSymbols':
        return 2;
      case 'basicSymbols':
      case 'highPaySymbols':
      case 'crowns':
      default:
        return 5;
    }
  };
  
  return (
    <div>
      {uiConfig.paytable.sections?.map(section => (
        <PayTableSection key={section.id}>
          {section.title && <SectionTitle>{section.title}</SectionTitle>}
          {section.description && <ItalicText>{section.description}</ItalicText>}
          <PayTableGrid 
            $columns={getColumnsForSection(section.id)}
            $gap={section.gap}
          >
            {renderSymbols(section.items, section.imageSize)}
          </PayTableGrid>
        </PayTableSection>
      ))}
    </div>
  );
};

export default PayTableContent;