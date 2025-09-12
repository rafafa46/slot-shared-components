import React from 'react';
import styled from 'styled-components';
import PaylineGrid from './PaylineGrid.js';
import { useGameState } from '../../../GameState/GameStateContext.js';
import {
  Text,
  SectionTitle
} from '../OverlayStyles.js';

const PaylinesContainer = styled.div`
  width: 100%;
`;

const PaylinesGridLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
`;

const PayLinesContent = () => {
  const { uiConfig } = useGameState();

  // Utiliser la configuration depuis uiConfig au lieu du hardcodé
  const paylinesConfig = uiConfig.paylines;

  return (
    <PaylinesContainer>
      <SectionTitle>PAYLINES</SectionTitle>
      <Text>
        {paylinesConfig.description}
      </Text>
      
      <PaylinesGridLayout>
        {paylinesConfig.paylines.map((payline, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <PaylineGrid 
              payline={payline} 
              index={index}
              gridConfig={paylinesConfig.gridConfig}
            />
          </div>
        ))}
      </PaylinesGridLayout>
    </PaylinesContainer>
  );
};

export default PayLinesContent;