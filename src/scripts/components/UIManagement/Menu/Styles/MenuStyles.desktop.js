import styled from 'styled-components';
import * as BaseStyles from './MenuStyles.base.js';

export const MenuContainer = styled(BaseStyles.MenuContainer)`
  width: 1400px;
  height: 900px;
`;

export const MenuBar = styled(BaseStyles.MenuBar)`
  width: 1400px;
  height: 90px;
`;

// ------------------------------------------- Spin section -----------------------------------------------

export const SpinButton = styled(BaseStyles.SpinButton)`
  left: 50%;
  bottom: 8px;
`;

export const TurboButton = styled(BaseStyles.TurboButton)`
  left: 42%;
  bottom: 15px;
  
  &:hover:not(:disabled) {
    &::before {
      background-color: ${props => {
        switch(props.$turboMode) {
          case 'turbo': return '#ff4f2b';
          case 'superTurbo': return '#197dff';
          default: return '#404040';
        }
      }};
    }
  }
`;

export const AutoplayButton = styled(BaseStyles.AutoplayButton)`
  left: 58%;
  bottom: 15px;

  &:hover:not(:disabled) {
    &::before {
      background-color: ${props => props.$active ? '#ff4f2b' : '#404040'};
    }
  }
`;

// ------------------------------------------- FeatureBuy  -----------------------------------------------

export const BuyFeatureButton = styled(BaseStyles.BuyFeatureButton)`
  right: 30px;
  bottom: 150px;

  &:hover:not(:disabled) {
    &::before {
      background-color: ${props => props.$isFeatureActive ? '#ff3636' : '#fcce00'};
    }
  }
`;

export const MenuButton = styled(BaseStyles.MenuButton)`
  left: 50px;
  bottom: 32px;
`;

// ------------------------------------------- Bet Control -----------------------------------------------

export const BetControl = styled(BaseStyles.BetControl)`
  right: 20px;
  bottom: 5px;
`;

// ------------------------------------------- Balance and Win -----------------------------------------------

export const BalanceContainer = styled(BaseStyles.BalanceContainer)`
  left: 150px;
  bottom: 20px;
`;

export const WinContainer = styled(BaseStyles.WinContainer)`
  left: 360px;
  bottom: 20px;
`;

export const FreeSpinsContainer = styled(BaseStyles.FreeSpinsContainer)`
  left: 800px;
  bottom: 20px;
`;
