import styled from 'styled-components';
import * as BaseStyles from './MenuStyles.base.js';

export const MenuContainer = styled(BaseStyles.MenuContainer)`
  width: 1920px;
  height: 1080px;
`;

export const MenuBar = styled(BaseStyles.MenuBar)`
  width: 1920px;
  height: 120px;
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
  right: 40px;
  bottom: 200px;

  &:hover:not(:disabled) {
    &::before {
      background-color: ${props => props.$isFeatureActive ? '#ff3636' : '#fcce00'};
    }
  }
`;

export const MenuButton = styled(BaseStyles.MenuButton)`
  left: 65px;
  bottom: 42px;
`;

// ------------------------------------------- Bet Control -----------------------------------------------

export const BetControl = styled(BaseStyles.BetControl)`
  right: 44px;
  bottom: 12px;
`;

// ------------------------------------------- Balance and Win -----------------------------------------------

export const BalanceContainer = styled(BaseStyles.BalanceContainer)`
  left: 200px;
  bottom: 28px;
`;

export const WinContainer = styled(BaseStyles.WinContainer)`
  left: 480px;
  bottom: 28px;
`;

export const FreeSpinsContainer = styled(BaseStyles.FreeSpinsContainer)`
  right: 480px;
  bottom: 28px;
`;

// ------------------------------------------- Autoplay panel -----------------------------------------------

export const AutoplayPanel = styled(BaseStyles.AutoplayPanel)`
  left: 58%;
  bottom: 120px;
`;

export const AutoplayOption = styled(BaseStyles.AutoplayOption)`
  &:hover {
    background: ${props => props.$selected ? '#ff2b0f' : '#404040'};
  }
`;

export const AutoplayStartButton = styled(BaseStyles.AutoplayStartButton)`
  &:hover {
    background: #ff4f2b;
  }
`;

export const AutoplaySpinsRemaining = styled(BaseStyles.AutoplaySpinsRemaining)`
  left: 61%;
  bottom: 40px;
`;
