import React from 'react';
import styled from 'styled-components';
import { UIAssetsManager } from '../../../UIAssetsManager.js';
import { useGameState } from '../../../GameState/GameStateContext.js';
import { formatCurrency } from '../../../currencyFormatter.js'
import {
  Text,
  PayTableSection,
  SectionTitle,
  PayTableGrid,
  SymbolCard,
  SymbolInfo
} from '../OverlayStyles.js';

const SymbolImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 12px;
`;

const ItalicText = styled(Text)`
  font-style: italic;
  margin-bottom: 15px;
`;

const PayTableContent = () => {
  // Utiliser directement currentBet du GameState
  const { currentBet } = useGameState();

  // Définir les symboles de base (cartes)
  //à faire: remplir correctement ceci
  const basicSymbols = [
    { name: '10', img: UIAssetsManager.getImageSrc('symbols-10'), payouts: [[5, '1.00'], [4, '0.40'], [3, '0.20']] },
    { name: 'J', img: UIAssetsManager.getImageSrc('symbols-J'), payouts: [[5, '1.00'], [4, '0.40'], [3, '0.20']] },
    { name: 'Q', img: UIAssetsManager.getImageSrc('symbols-Q'), payouts: [[5, '1.00'], [4, '0.40'], [3, '0.20']] },
    { name: 'K', img: UIAssetsManager.getImageSrc('symbols-K'), payouts: [[5, '1.00'], [4, '0.40'], [3, '0.20']] },
    { name: 'A', img: UIAssetsManager.getImageSrc('symbols-A'), payouts: [[5, '1.00'], [4, '0.40'], [3, '0.20']] }
  ];

  // Définir les symboles de haut paiement
  const highPaySymbols = [
    { name: 'Knight', img: UIAssetsManager.getImageSrc('symbols-Knight'), payouts: [[5, '3.00'], [4, '1.20'], [3, '0.60']] },
    { name: 'King', img: UIAssetsManager.getImageSrc('symbols-King'), payouts: [[5, '4.00'], [4, '1.60'], [3, '0.80']] },
    { name: 'Queen', img: UIAssetsManager.getImageSrc('symbols-Queen'), payouts: [[5, '5.00'], [4, '2.00'], [3, '1.00']] },
    { name: 'Wizard', img: UIAssetsManager.getImageSrc('symbols-Wizard'), payouts: [[5, '7.00'], [4, '2.80'], [3, '1.40']] },
    { name: 'Hero', img: UIAssetsManager.getImageSrc('symbols-Hero'), payouts: [[5, '10.00'], [4, '5.00'], [3, '2.00']] }
  ];

  // Définir les symboles spéciaux
  const specialSymbols = [
    { name: 'Wild', img: UIAssetsManager.getImageSrc('symbols-Wild'), description: 'Replaces all symbols except Scatter' },
    { name: 'Scatter', img: UIAssetsManager.getImageSrc('symbols-Scatter'), description: '3 or more triggers Bonus game' }
  ];

  const crowns = [
    { name: 'crown-add', img: UIAssetsManager.getImageSrc('symbols-crown_add'), description: 'Adds a 12x multiplier at the end of each spin' },
    { name: 'crown-spread', img: UIAssetsManager.getImageSrc('symbols-crown_spread'), description: 'Spreads multipliers to all other symbols' },
    { name: 'crown-copy', img: UIAssetsManager.getImageSrc('symbols-crown_copy'), description: 'Copies multipliers of other symbols' },
    { name: 'crown-moveAndAdd', img: UIAssetsManager.getImageSrc('symbols-crown_moveAndAdd'), description: 'Moves to a symbol and adds a 10x multiplier at the end of each spin' },
    { name: 'crown-multiply', img: UIAssetsManager.getImageSrc('symbols-crown_multiply'), description: 'multiplies the symbol multipliers by 5' },
  ];

  // Fonction pour calculer les gains multipliés par le bet
  const calculatePayout = (value) => {
    // Convertir en nombre, multiplier par le bet, puis reformater
    const rawValue = parseFloat(value);
    const multipliedValue = formatCurrency(rawValue * currentBet);
    return multipliedValue;
  };

  // Fonction pour rendre les tableaux de paiement
  const renderPayouts = (payouts) => {
    return payouts.map((payout, index) => (
      <div key={index} style={{ display: 'fixed', justifyContent: 'space-between', margin: '5px 0' }}>
        <span style={{ color: '#FFC107', fontWeight: 'bold' }}>{payout[0]}</span>
        <span style={{ marginLeft: '10px', color: 'white' }}>
          {calculatePayout(payout[1])}
        </span>
      </div>
    ));
  };

  // Fonction pour rendre les symboles
  const renderSymbols = (symbols) => {
    return symbols.map((symbol, index) => (
      <SymbolCard key={index}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <SymbolImage src={symbol.img} alt={symbol.name} />
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

  return (
    <div>
      <PayTableSection>
        <PayTableGrid $columns={5}>
          {renderSymbols(basicSymbols)}
        </PayTableGrid>
      </PayTableSection>

      <PayTableSection>
        <PayTableGrid $columns={5}>
          {renderSymbols(highPaySymbols)}
        </PayTableGrid>
      </PayTableSection>

      <PayTableSection>
        <SectionTitle>SPECIAL SYMBOLS</SectionTitle>
        <PayTableGrid $columns={2}>
          {renderSymbols(specialSymbols)}
        </PayTableGrid>
      </PayTableSection>

      <PayTableSection>
        <SectionTitle>CROWNS</SectionTitle>
        <ItalicText>For the complete description of how crowns work, go to the "Rules" tab</ItalicText>
        <PayTableGrid $columns={5}>
          {renderSymbols(crowns)}
        </PayTableGrid>
      </PayTableSection>
    </div>
  );
};

export default PayTableContent;