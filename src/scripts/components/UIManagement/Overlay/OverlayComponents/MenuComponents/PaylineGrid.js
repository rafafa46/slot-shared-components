import React from 'react';
import styled from 'styled-components';

// Styles pour la grille de payline
const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  background-color: rgba(0, 0, 0, 0.5);
`;

const GridRow = styled.div`
  display: flex;
  height: 24px;
`;

const GridCell = styled.div`
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 1);
  background-color: ${props => props.$active ? '#db9437' : 'transparent'};
`;

const PaylineGridWrapper = styled.div`
  position: relative;
  margin: 8px;
`;

const PaylineGrid = ({ payline, index }) => {
  
  const rows = 4;
  const cols = 5;
  
  // Créer une matrice pour représenter la grille
  const grid = Array(rows).fill().map(() => Array(cols).fill(false));
  
  // Marquer les cellules actives sur la base des coordonnées de la payline
  payline.forEach(cell => {
    grid[cell.row][cell.col] = true;
  });
  
  return (
    <PaylineGridWrapper>
      <GridContainer>
        {grid.map((row, rowIndex) => (
          <GridRow key={rowIndex}>
            {row.map((active, colIndex) => (
              <GridCell key={colIndex} $active={active} />
            ))}
          </GridRow>
        ))}
      </GridContainer>
    </PaylineGridWrapper>
  );
};

export default PaylineGrid;