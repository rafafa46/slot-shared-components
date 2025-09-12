import React from 'react';
import styled from 'styled-components';
import { UIAssetsManager } from '../../../UIAssetsManager.js';
import { useGameState } from '../../../GameState/GameStateContext.js';
import { formatCurrency } from '../../../currencyFormatter.js';
import {
  Text,
  PayTableSection,
  SectionTitle,
  PayTableGrid,
  SymbolCard,
  SymbolInfo
} from '../OverlayStyles.js';

// à faire: remettre 100px au lieu de 10
const SymbolImage = styled.img`
  width: ${props => props.$size || '10px'};
  height: ${props => props.$size || '10px'};
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
      <div key={index} style={{ margin: '5px 0' }}>
        <span style={{ color: '#FFC107', fontWeight: 'bold' }}>{payout[0]}</span>
        <span style={{ marginLeft: '10px', color: 'white' }}>
          {calculatePayout(payout[1])}
        </span>
      </div>
    ));
  };

  const renderSymbols = (symbols) => {
    return symbols.map((symbol, index) => (
      <SymbolCard key={index}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <SymbolImage 
            src={UIAssetsManager.getImageSrc(symbol.image)}
            alt={symbol.name}
            $size={symbol.imageSize}
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
          <PayTableGrid $columns={getColumnsForSection(section.id)}>
            {renderSymbols(section.items)}
          </PayTableGrid>
        </PayTableSection>
      ))}
    </div>
  );
};

export default PayTableContent;