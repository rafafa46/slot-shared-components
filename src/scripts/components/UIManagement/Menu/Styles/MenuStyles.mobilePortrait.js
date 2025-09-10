import styled from 'styled-components';
import * as BaseStyles from './MenuStyles.base.js';

export const MenuContainer = styled(BaseStyles.MenuContainer)`
  width: 750px;
  height: 1334px;
`;

export const MenuBar = styled(BaseStyles.MenuBar)`
  width: 750px;
  height: 80px;
  background: rgba(0, 0, 0, 0.8);
`;

// ------------------------------------------- Spin section -----------------------------------------------

export const SpinButton = styled(BaseStyles.SpinButton)`
  --base-scale: 1.5;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%) scale(var(--base-scale));
`;

export const TurboButton = styled(BaseStyles.TurboButton)`
  --base-scale: 1.5;
  left: 28%;
  bottom: 110px;
  transform: translateX(-50%) scale(var(--base-scale));
`;

export const AutoplayButton = styled(BaseStyles.AutoplayButton)`
  --base-scale: 1.5;
  left: 72%;
  bottom: 110px;
  transform: translateX(-50%) scale(var(--base-scale));
`;

export const BuyFeatureButton = styled(BaseStyles.BuyFeatureButton)`
  --base-scale: 1.1;
  right: -25px;
  bottom: 130px;
  transform: translateX(-50%) scale(var(--base-scale));
`;

export const MenuButton = styled(BaseStyles.MenuButton)`
  left: 64px;
  bottom: 150px;
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
  left: 20px;
  bottom: 15px;
`;

export const WinContainer = styled(BaseStyles.WinContainer)`
  left: 180px;
  bottom: 15px;
`;
