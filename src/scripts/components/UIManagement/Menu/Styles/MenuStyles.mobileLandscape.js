import styled from 'styled-components';
import * as BaseStyles from './MenuStyles.base.js';

export const MenuContainer = styled(BaseStyles.MenuContainer)`
  width: 1634px;
  height: 750px;
`;

export const MenuBar = styled(BaseStyles.MenuBar)`
  width: 1634px;
  height: 80px;
  background: rgba(0, 0, 0, 0.8);
`;

// ------------------------------------------- Spin section -----------------------------------------------

export const SpinButton = styled(BaseStyles.SpinButton)`
  --base-scale: 1.5;
  --button-transform: translateY(50%);
  right: 100px;
  bottom: 50%;
  transform: var(--button-transform) scale(var(--base-scale));
`;

export const TurboButton = styled(BaseStyles.TurboButton)`
  --base-scale: 1.5;
  --button-transform: translateY(50%);
  right: 130px;
  bottom: 28%;
  transform: var(--button-transform) scale(var(--base-scale));
`;

export const AutoplayButton = styled(BaseStyles.AutoplayButton)`
  --base-scale: 1.5;
  --button-transform: translateY(50%);
  right: 130px;
  bottom: 72%;
  transform: var(--button-transform) scale(var(--base-scale));
`;

export const BuyFeatureButton = styled(BaseStyles.BuyFeatureButton)`
  --base-scale: 1.1;
  --button-transform: translateY(50%);
  right: 220px;
  top: 0px;
  transform: var(--button-transform) scale(var(--base-scale));
`;

export const MenuButton = styled(BaseStyles.MenuButton)`
  left: 64px;
  bottom: 26px;
  scale: 1.5;
`;

// ------------------------------------------- Bet Control -----------------------------------------------

export const BetControl = styled(BaseStyles.BetControl)`
  right: 20px;
  bottom: 0px;
`;

export const BetButton = styled(BaseStyles.BetButton)`
  scale: 1.4;
`;

// ------------------------------------------- Balance and Win -----------------------------------------------

export const BalanceContainer = styled(BaseStyles.BalanceContainer)`
  left: 150px;
  bottom: 15px;
`;

export const WinContainer = styled(BaseStyles.WinContainer)`
  left: 300px;
  bottom: 15px;
`;
