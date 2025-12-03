import styled from 'styled-components';
import * as BaseStyles from './MenuStyles.base.js';

export const MenuContainer = styled(BaseStyles.MenuContainer)`
  width: 820px;
  height: 1458px;
`;

export const MenuBar = styled(BaseStyles.MenuBar)`
  width: 820px;
  height: 90px;
  background: rgba(0, 0, 0, 0.8);
`;

// ------------------------------------------- Spin section -----------------------------------------------

export const SpinButton = styled(BaseStyles.SpinButton)`
  --base-scale: 1.3;
  left: 50%;
  bottom: 90px;
`;

export const TurboButton = styled(BaseStyles.TurboButton)`
  --base-scale: 1.3;
  left: 28%;
  bottom: 110px;
`;

export const AutoplayButton = styled(BaseStyles.AutoplayButton)`
  --base-scale: 1.3;
  left: 72%;
  bottom: 110px;
`;

export const BuyFeatureButton = styled(BaseStyles.BuyFeatureButton)`
  --base-scale: 1;
  right: -40px;
  bottom: 180px;
`;

export const MenuButton = styled(BaseStyles.MenuButton)`
  left: 85px;
  bottom: 130px;
  scale: 1.5;
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
  left: 20px;
  bottom: 15px;
`;

export const WinContainer = styled(BaseStyles.WinContainer)`
  left: 260px;
  bottom: 15px;
`;

export const FreeSpinsContainer = styled(BaseStyles.FreeSpinsContainer)`
  left: 670px;
  bottom: 90px;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 10px;
`;

// ------------------------------------------- Autoplay panel -----------------------------------------------

export const AutoplayPanel = styled(BaseStyles.AutoplayPanel)`
  --base-scale: 1.7;
  left: 50%;
  bottom: 380px;
`;

export const AutoplaySpinsRemaining = styled(BaseStyles.AutoplaySpinsRemaining)`
  --base-scale: 1.3;
  --remaining-transform: translateX(-50%);
  left: 72%;
  bottom: 225px;
`;