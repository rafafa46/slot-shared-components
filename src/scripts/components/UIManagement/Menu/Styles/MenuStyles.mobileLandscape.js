import styled from 'styled-components';
import * as BaseStyles from './MenuStyles.base.js';

export const MenuContainer = styled(BaseStyles.MenuContainer)`
  width: 1458px;
  height: 820px;
`;

export const MenuBar = styled(BaseStyles.MenuBar)`
  width: 1458px;
  height: 90px;
  background: rgba(0, 0, 0, 0.8);
`;

// ------------------------------------------- Spin section -----------------------------------------------

export const SpinButton = styled(BaseStyles.SpinButton)`
  --base-scale: 1.3;
  --button-transform: translateY(50%);
  right: 50px;
  bottom: 50%;
`;

export const TurboButton = styled(BaseStyles.TurboButton)`
  --base-scale: 1.3;
  --button-transform: translateY(50%);
  right: 80px;
  bottom: 28%;
`;

export const AutoplayButton = styled(BaseStyles.AutoplayButton)`
  --base-scale: 1.3;
  --button-transform: translateY(50%);
  right: 80px;
  bottom: 72%;
`;

export const BuyFeatureButton = styled(BaseStyles.BuyFeatureButton)`
  --base-scale: 1;
  --button-transform: translateY(50%);
  right: 120px;
  bottom: 90%;
`;

export const MenuButton = styled(BaseStyles.MenuButton)`
  left: 64px;
  bottom: 26px;
  scale: 1.3;
`;

// ------------------------------------------- Bet Control -----------------------------------------------

export const BetControl = styled(BaseStyles.BetControl)`
  right: 20px;
  bottom: 0px;
`;

export const BetButton = styled(BaseStyles.BetButton)`
  scale: 1.2;
`;

// ------------------------------------------- Balance and Win -----------------------------------------------

export const BalanceContainer = styled(BaseStyles.BalanceContainer)`
  left: 150px;
  bottom: 10px;
`;

export const WinContainer = styled(BaseStyles.WinContainer)`
  left: 450px;
  bottom: 10px;
`;

export const FreeSpinsContainer = styled(BaseStyles.FreeSpinsContainer)`
  left: 800px;
  bottom: 10px;
`;

// ------------------------------------------- Autoplay panel -----------------------------------------------

export const AutoplayPanel = styled(BaseStyles.AutoplayPanel)`
  --base-scale: 1.7;
  --panel-transform: translateY(50%);
  right: 380px;
  bottom: 50%;
`;

export const AutoplaySpinsRemaining = styled(BaseStyles.AutoplaySpinsRemaining)`
  --base-scale: 1.3;
  --remaining-transform: translateY(50%);
  right: 200px;
  bottom: 72%;
`;
