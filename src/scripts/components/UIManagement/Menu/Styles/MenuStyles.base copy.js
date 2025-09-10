import styled from 'styled-components';

export const MenuContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
`;

export const MenuBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
`;

export const Button = styled.button`
  -webkit-tap-highlight-color: transparent;
  position: absolute;
  background-color: transparent;
  color: white;
  border: none;
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 44px;
  transition: background-color 0.3s;
  pointer-events: auto;

  &:disabled {
    color: #999999;
    cursor: default;
  }
`;

export const CircularButton = styled(Button)`
  border-radius: 50%;
  width: 66px;
  height: 66px;
  font-size: 36px;
  transform: var(--button-transform, translateX(-50%)) scale(var(--base-scale, 1));
  transition: all 0.1s ease;
  pointer-events: auto;
`;

// ------------------------------------------- Spin section -----------------------------------------------

export const SpinButton = styled(Button)`
  width: 120px;
  height: 120px;
  box-shadow: ${props => props.$isFeatureActive 
    ? '0px 0px 16px 4px rgba(71, 255, 236, 0.5)'
    : '0px 0px 12px 8px rgba(0, 0, 0, 0.3)'};

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${props => props.$isFeatureActive ? '#47ffec' : 'White'};
    mask: url(${props => props.$bgImageBig}) center/contain no-repeat;
    transition: background-color 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #505050;
    mask: url(${props => props.$bgImageSmall}) center no-repeat;
  }

  &:active:not(:disabled),
  &:disabled {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.92));
    box-shadow: ${props => props.$isFeatureActive 
      ? '0px 0px 12px 2px rgba(71, 255, 236, 0.8)'
      : '0px 0px 12px 4px rgba(0, 0, 0, 0.3)'};
  }

  &:disabled {
    opacity: 0.7;
  }
`;

export const SpinIconContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  filter: ${props => props.$isFeatureActive 
    ? 'drop-shadow(0px 0px 4px rgba(145, 255, 244, 0.5))'
    : 'none'};
`;

export const SpinIcon = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${props => props.$isFeatureActive ? '#d4fffa' : 'White'};
  mask: url(${props => props.$bgImageSpin}) center no-repeat;
`;


export const SpinButton_old = styled(CircularButton)`
  background-color: ${props => props.$isFeatureActive ? '#20e3cf' : '#4caf50'};
  width: 120px;
  height: 120px;
  font-size: 86px;
  box-shadow: 0px 0px 12px 8px rgba(0,0,0,0.3);

  &:hover:not(:disabled) {
    background-color: ${props => props.$isFeatureActive ? '#33ffeb' : '#4cd452'};
  }

  &:active:not(:disabled) {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.92));
    box-shadow: 0px 0px 12px 4px rgba(0,0,0,0.3);
  }

  &:disabled {
    background-color: ${props => props.$isFeatureActive ? '#18c9b7' : '#3f9142'};
    color: #ededed;
  }
`;

export const SpinButton = styled(CircularButton)`
  background-color: transparent;
  width: 120px;
  height: 120px;
  font-size: 86px;
  box-shadow: 0px 0px 12px 8px rgba(0,0,0,0.3);
  position: absolute;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.$bgImageBig}); 
    background-size: contain; // Assure que l'image s'adapte
    background-repeat: no-repeat;
    background-position: center;
    filter: ${props => props.$isFeatureActive 
      ? 'brightness(0) saturate(100%) invert(82%) sepia(97%) saturate(4492%) hue-rotate(162deg) brightness(101%) contrast(101%)' 
      : 'brightness(0) saturate(100%) invert(100%)'};
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90.83%; // 109px sur 120px = 90.83%
    height: 90.83%;
    transform: translate(-50%, -50%);
    background-image: url(${props => props.$bgImageSmall}); 
    background-size: contain; // Assure que l'image s'adapte
    background-repeat: no-repeat;
    background-position: center;
    filter: brightness(0) saturate(100%) invert(31%) sepia(0%) saturate(0%) hue-rotate(195deg) brightness(96%) contrast(92%);
    z-index: 2;
  }

  // Cache l'icône SVG existante
  svg {
    display: none;
  }

  &:active:not(:disabled) {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.92));
    box-shadow: 0px 0px 12px 4px rgba(0,0,0,0.3);
  }

  &:disabled {
    opacity: 0.7;
  }
`;

export const SpinIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 49.17%; // 59px sur 120px = 49.17%
  height: 63.33%; // 76px sur 120px = 63.33%
  transform: translate(-50%, -50%);
  background-image: url(${props => props.$bgImageSpin}); 
  background-size: contain; // Assure que l'image s'adapte
  background-repeat: no-repeat;
  background-position: center;
  filter: brightness(0) saturate(100%) invert(100%); // Garde l'icône blanche
  z-index: 3;
  pointer-events: none; // Important pour que les clics passent au bouton
`;

export const TurboButton = styled(CircularButton)`
  background-color: ${props => props.$active ? '#ff2b0f' : '#808080'};
  box-shadow: 0px 0px 8px 6px rgba(0,0,0,0.3);

  &:active:not(:disabled) {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.9));
    box-shadow: 0px 0px 4px 3px rgba(0,0,0,0.3);
  }

  &:hover {
    background-color: ${props => props.$active ? '#ff4f2b' : '#a9a9a9'};
  }
`;

export const AutoplayButton = styled(CircularButton)`
  background-color: ${props => props.$active ? '#ff2b0f' : '#808080'};
  box-shadow: 0px 0px 8px 6px rgba(0,0,0,0.3);

  &:active:not(:disabled) {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.9));
    box-shadow: 0px 0px 4px 3px rgba(0,0,0,0.3);
  }

  &:hover {
    background-color: ${props => props.$active ? '#ff4f2b' : '#a9a9a9'};
  }

  &:disabled {
    background-color: #6b6b6b;
  }
`;

// ------------------------------------------- FeatureBuy  -----------------------------------------------

export const BuyFeatureButton = styled(CircularButton)`
  background-color: ${props => props.$isFeatureActive ? '#dc2626' : '#ffa500'};
  width: 100px;
  height: 100px;
  font-size: 18px;
  line-height: 1.2;
  box-shadow: 0px 0px 12px 8px rgba(0,0,0,0.3);

  &:hover {
    background-color: ${props => props.$isFeatureActive ? '#ff3636' : '#fcce00'};
  }

  &:active:not(:disabled) {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.92));
    box-shadow: 0px 0px 6px 4px rgba(0,0,0,0.3);
  }
  
  &:disabled {
    background-color: ${props => props.$isFeatureActive ? '#dc2626' : '#ffa500'};
    opacity: 0.8;
    color: #ededed;
  }
`;

export const MenuButton = styled(Button)`
`;

// ------------------------------------------- Bet Control -----------------------------------------------

export const BetControl = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  pointer-events: auto;
`;

export const BetLabel = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
  color: ${props => props.$isFeatureActive ? '#33ffeb' : 'white'};
`;

export const BetValues = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const BetButton = styled.button`
  -webkit-tap-highlight-color: transparent;
  background-color: transparent;
  color: ${props => props.$isFeatureActive ? '#33ffeb' : 'white'};
  border: none;
  font-size: 46px;
  cursor: pointer;
  transition: all 0.1s ease;

  &:active:not(:disabled) {
    transform: scale(0.9);
  }

  &:disabled {
    color: ${props => props.$isFeatureActive ? '#18c9b7' : '#b8b8b8'};
    cursor: default;
  }
`;

export const BetDisplay = styled.span`
  margin: 0 10px;
  font-size: 24px;
  min-width: 110px; // Fixe la largeur minimale pour éviter les décalages
  text-align: center;
  color: ${props => props.$isFeatureActive ? '#33ffeb' : 'white'};
`;

// ------------------------------------------- Balance and Win -----------------------------------------------

export const BalanceContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const BalanceLabel = styled.div`
  font-size: 16px;
  color: white;
`;

export const BalanceAmount = styled.div`
  font-size: 22px;
    color: white;
`;

export const WinContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const WinLabel = styled.div`
  font-size: 16px;
  color: white;
`;

export const WinAmount = styled.div`
  font-size: 22px;
  color: #ffd700;
`;