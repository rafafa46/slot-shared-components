import React from 'react';
import styled from 'styled-components';
import PaylineGrid from './PaylineGrid.js';
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
  // Configuration des paylines
  const paylines = [
    [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}, {row: 0, col: 4}],
        [{row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}],
        [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}],
        [{row: 3, col: 0}, {row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}, {row: 3, col: 4}],
        [{row: 0, col: 0}, {row: 1, col: 1}, {row: 0, col: 2}, {row: 1, col: 3}, {row: 0, col: 4}],
        [{row: 1, col: 0}, {row: 0, col: 1}, {row: 1, col: 2}, {row: 0, col: 3}, {row: 1, col: 4}],
        [{row: 1, col: 0}, {row: 2, col: 1}, {row: 1, col: 2}, {row: 2, col: 3}, {row: 1, col: 4}],
        [{row: 2, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}, {row: 1, col: 3}, {row: 2, col: 4}],
        [{row: 2, col: 0}, {row: 3, col: 1}, {row: 2, col: 2}, {row: 3, col: 3}, {row: 2, col: 4}],
        [{row: 3, col: 0}, {row: 2, col: 1}, {row: 3, col: 2}, {row: 2, col: 3}, {row: 3, col: 4}],
        // [{row: 0, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}, {row: 1, col: 3}, {row: 0, col: 4}],
        // [{row: 1, col: 0}, {row: 2, col: 1}, {row: 3, col: 2}, {row: 2, col: 3}, {row: 1, col: 4}],
        // [{row: 2, col: 0}, {row: 1, col: 1}, {row: 0, col: 2}, {row: 1, col: 3}, {row: 2, col: 4}],
        // [{row: 3, col: 0}, {row: 2, col: 1}, {row: 1, col: 2}, {row: 2, col: 3}, {row: 3, col: 4}],
        [{row: 0, col: 0}, {row: 0, col: 1}, {row: 1, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}],
        [{row: 1, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}, {row: 3, col: 3}, {row: 3, col: 4}],
        [{row: 2, col: 0}, {row: 2, col: 1}, {row: 1, col: 2}, {row: 0, col: 3}, {row: 0, col: 4}],
        [{row: 3, col: 0}, {row: 3, col: 1}, {row: 2, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}],
  ];

  return (
    <PaylinesContainer>
      <SectionTitle>PAYLINES</SectionTitle>
      <Text>
        This game has 14 paylines that pay from left to right.
        Please consult the paytable for the the number of each symbol required to win.
      </Text>
      
      <PaylinesGridLayout>
        {paylines.map((payline, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <PaylineGrid payline={payline} index={index} />
          </div>
        ))}
      </PaylinesGridLayout>
    </PaylinesContainer>
  );
};

export default PayLinesContent;