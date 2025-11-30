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
  background: rgba(0, 0, 0, 0.7);
`;

export const Button = styled.button`
  -webkit-tap-highlight-color: transparent;
  position: absolute;
  background-color: transparent;
  color: white;
  border: none;
  display: flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 60px;
  pointer-events: auto;
  transition: all 0.1s ease;
  transform: var(--button-transform, translateX(-50%)) scale(var(--base-scale, 1));

  &:disabled {
    color: #999999;
    cursor: default;
  }
`;

// ------------------------------------------- Spin section -----------------------------------------------

export const SpinButton = styled(Button)`
  width: 162px;
  height: 162px;
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
    background-color: #303030;
    mask: url(${props => props.$bgImageSmall}) center no-repeat;
    transition: background-color 0.2s ease;
  }

  /* État pressé unifié */
  &:active:not(:disabled),
  &.touch-pressed:not(:disabled),
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
    ? 'drop-shadow(0px 0px 4px rgba(145, 255, 244, 0.3))'
    : 'none'};
`;

export const SpinIcon = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${props => props.$isFeatureActive ? '#d4fffa' : 'White'};
  mask: url(${props => props.$bgImageSpin}) center no-repeat;
`;

// ------------------------------------------- Turbo Button -----------------------------------------------

export const TurboButton = styled(Button)`
  width: 89px;
  height: 89px;
  box-shadow: 0px 0px 8px 6px rgba(0,0,0,0.3);

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${props => {
      switch(props.$turboMode) {
        case 'turbo': return '#ff2b0f';
        case 'superTurbo': return '#0066ff';
        default: return '#303030';
      }
    }};
    mask: url(${props => props.$bgImage}) center/contain no-repeat;
    transition: background-color 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    mask: url(${props => props.$iconImage}) center no-repeat;
  }

  &:active:not(:disabled),
  &.touch-pressed:not(:disabled) {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.9));
    box-shadow: 0px 0px 4px 3px rgba(0,0,0,0.3);
  }
`;
// ------------------------------------------- Autoplay Button -----------------------------------------------

export const AutoplayButton = styled(Button)`
  width: 89px;
  height: 89px;
  box-shadow: 0px 0px 8px 6px rgba(0,0,0,0.3);

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${props => props.$active ? '#ff2b0f' : '#303030'};
    mask: url(${props => props.$bgImage}) center/contain no-repeat;
    transition: background-color 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    mask: url(${props => props.$iconImage}) center no-repeat;
  }

  &:active:not(:disabled),
  &.touch-pressed:not(:disabled) {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.9));
    box-shadow: 0px 0px 4px 3px rgba(0,0,0,0.3);
  }

  &:disabled {
    opacity: 0.7;
  }
`;

// ------------------------------------------- Feature Buy Button -----------------------------------------------

export const BuyFeatureButton = styled(Button)`
  width: 134px;
  height: 134px;
  font-size: 24px;
  line-height: 1.2;
  box-shadow: 0px 0px 12px 8px rgba(0,0,0,0.3);
  color: white;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${props => props.$isFeatureActive ? '#dc2626' : '#ffa500'};
    mask: url(${props => props.$bgImage}) center/contain no-repeat;
    transition: background-color 0.2s ease;
    z-index: -1;
  }

  &:active:not(:disabled),
  &.touch-pressed:not(:disabled) {
    transform: var(--button-transform, translateX(-50%)) scale(calc(var(--base-scale, 1) * 0.92));
    box-shadow: 0px 0px 6px 4px rgba(0,0,0,0.3);
  }

  &:disabled {
  color: #ededed;
    &::before {
      opacity: 0.7;
    }
  }
`;

// ------------------------------------------- Menu Button -----------------------------------------------

export const MenuButton = styled(Button)`
  width: 46px;
  height: 35px;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    mask: url(${props => props.$bgImage}) center/contain no-repeat;
  }
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
  font-size: 22px;
  margin-bottom: 7px;
  color: ${props => props.$isFeatureActive ? '#33ffeb' : 'white'};
`;

export const BetValues = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
`;

// ------------------------------------------- Bet Button -----------------------------------------------

export const BetButton = styled(Button)`
  position: relative;
  transform: none;

  width: 53px;
  height: 53px;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${props => props.$isFeatureActive ? '#33ffeb' : 'white'};
    mask: url(${props => props.$bgImage}) center/contain no-repeat;
    transition: background-color 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${props => props.$isFeatureActive ? '#33ffeb' : 'white'};
    mask: url(${props => props.$iconImage}) center no-repeat;
    transition: filter 0.2s ease;
  }

  &:active:not(:disabled),
  &.touch-pressed:not(:disabled) {
    transform: scale(0.9);
  }

  &:disabled {
    opacity: 0.7;
  }
`;

export const BetDisplay = styled.span`
  margin: 0 10px;
  font-size: 30px;
  min-width: 150px;
  text-align: center;
  color: ${props => props.$isFeatureActive ? '#33ffeb' : 'white'};
`;

// ------------------------------------------- Balance, Win, Freespins -----------------------------------------------

export const BalanceContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const BalanceLabel = styled.div`
  font-size: 22px;
  color: white;
`;

export const BalanceAmount = styled.div`
  font-size: 30px;
  color: white;
`;

export const WinContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const WinLabel = styled.div`
  font-size: 22px;
  color: white;
`;

export const WinAmount = styled.div`
  font-size: 30px;
  color: #ffd700;
`;

export const FreeSpinsContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FreeSpinsLabel = styled.div`
  font-size: 22px;
  color: white;
`;

export const FreeSpinsAmount = styled.div`
  font-size: 30px;
  color: #47ffec;
  font-weight: bold;
`;

// ----------------------------------------------- autoplay panel ---------------------------------------------------------

export const AutoplayPanelOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: auto;
`;

export const AutoplayPanel = styled.div`
  position: absolute;
  z-index: 5;
  transform: var(--panel-transform, translateX(-50%)) scale(var(--base-scale, 1));
  background: rgba(0, 0, 0, 0.95);
  border-radius: 12px;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  pointer-events: auto;
`;

export const AutoplayOption = styled.button`
  width: 80px;
  height: 44px;
  border-radius: 9999px;
  border: 2px solid ${props => props.$selected ? '#ff2b0f' : 'rgba(255, 255, 255, 0)'};
  background: ${props => props.$selected ? '#ff2b0f' : '#303030'};
  color: white;
  font-size: 22px;
  font-weight: bold;
  cursor: ${props => props.$selected ? 'default' : 'pointer'};
  transition: all 0.15s ease;
`;

export const AutoplayStartButton = styled.button`
  grid-column: span 3;
  height: 44px;
  border-radius: 9999px;
  border: none;
  background: #ff2b0f;
  color: white;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-top: 4px;
  
  &:active {
    transform: scale(0.95);
  }
`;

export const AutoplaySpinsRemaining = styled.div`
  position: absolute;
  transform: var(--remaining-transform, translateX(-50%)) scale(var(--base-scale, 1));
  background: #ff2b0f;
  color: white;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 24px;
  font-weight: bold;
`;