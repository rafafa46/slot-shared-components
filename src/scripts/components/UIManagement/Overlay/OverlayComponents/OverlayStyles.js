import styled, { keyframes, css } from 'styled-components';

// ----------------------------------------
// Animations
// ----------------------------------------
export const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const scaleInAnimation = keyframes`
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
`;

// ----------------------------------------
// Common Styles
// ----------------------------------------
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const absoluteCenter = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// ----------------------------------------
// Base Overlay Components
// ----------------------------------------
export const OverlayWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  //${flexCenter}
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  pointer-events: ${props => props.$hasPointerEvents ? 'auto' : 'none'};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  animation: ${fadeInAnimation} 0.3s ease-out;
`;

export const ContentContainer = styled.div`
  position: fixed;
  top: 50px;
  left: 50px;
  right: 50px;
  bottom: 50px;
  background-color: rgba(13, 14, 17, 0.96);
  border-radius: 8px;
  padding: 10px;
  overflow: auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  &::-webkit-scrollbar {
    width: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    margin-top: 80px;
    margin-bottom: 20px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgb(251, 191, 36);
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgb(251, 166, 36);
    background-clip: content-box;
  }
  
  /* Cache les boutons de flèches */
  &::-webkit-scrollbar-button {
    display: none;
  }
  
  /* Firefox fallback (moins de contrôle mais reste fonctionnel) */
  @supports not (selector(::-webkit-scrollbar)) {
    scrollbar-width: thin;
    scrollbar-color: rgb(251, 191, 36) rgba(0, 0, 0, 0.2);
  }
  
  //${props => props.$customStyles}
`;

export const CloseButton = styled.button`
  position: fixed;
  top: 70px;
  right: 70px;
  width: 40px;
  height: 40px;
  ${flexCenter}
  color: rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1000;
  
  &:hover {
    color: white;
    border-color: white;
    background: rgba(0, 0, 0, 0.4);
  }
`;

// ----------------------------------------
// Common Content Components
// ----------------------------------------
export const FlexContainer = styled.div`
  ${flexColumn}
  align-items: center;
  gap: ${props => props.$gap || '16px'};
  max-width: ${props => props.$maxWidth || 'none'};
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  color: white;
  letter-spacing: 0.05em;
  margin-bottom: 5 px;
`;

export const SubTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: ${props => props.$color || 'rgb(251, 191, 36)'};
  margin-bottom: 1rem;
`;

export const Text = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 1.5;
`;

export const AnimatedText = styled.div`
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  animation: ${bounceAnimation} 1s infinite ease-in-out;
`;

// ----------------------------------------
// Image Components
// ----------------------------------------
export const ImageContainer = styled.div`
  width: ${props => props.$size || '256px'};
  height: ${props => props.$size || '256px'};
  position: relative;
  margin-bottom: 20px;
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: ${pulseAnimation} 2s infinite ease-in-out;
`;

export const BlurBackground = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${props => props.$color || 'rgba(59, 130, 246, 0.2)'};
  filter: blur(20px);
  z-index: -1;
  border-radius: 9999px;
`;

// ----------------------------------------
// Button Components
// ----------------------------------------
export const Button = styled.button`
  ${flexCenter}
  padding: 5px 10px;
  font-weight: bold;
  border-radius: 2px;
  font-size: 1.125rem;
  transition: all 0.2s;
  color: white;
  border: none;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ActivateButton = styled(Button)`
  background-color: rgb(249, 115, 22);
  padding: 8px 20px;
  width: 100%;
  max-width: 180px;
  
  &:hover:not(:disabled) {
    background-color: rgb(234, 88, 12);
  }
`;

export const SuccessButton = styled(Button)`
  background-color: rgb(22, 163, 74);
  padding: 8px 16px;
  min-width: 80px;
  
  &:hover:not(:disabled) {
    background-color: rgb(21, 128, 61);
  }
`;

export const DangerButton = styled(Button)`
  background-color: rgb(220, 38, 38);
  padding: 8px 16px;
  min-width: 80px;
  
  &:hover:not(:disabled) {
    background-color: rgb(185, 28, 28);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  //margin-top: ${props => props.$marginTop || '16px'};
  justify-content: center;
`;
// ----------------------------------------
// Feature Overlay Components
// ----------------------------------------
export const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  justify-content: center;
  //max-width: 640px; /* 2 cartes max : 300px + 300px + 20px gap = 620px + marge */
  //margin: 0 auto;
`;

export const FeatureCard = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 6px;
  width: 290px;
  height: 360px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* Empêche la carte de rétrécir */
`;

export const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

export const CardTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  text-align: center;
`;

export const CardDescription = styled.p`
  color: rgb(209, 213, 219);
  text-align: left;
  margin-bottom: 12px;
`;

export const Volatility = styled.div`
  color: rgb(156, 163, 175);
  font-style: italic;
  font-size: 0.875rem;
  margin-bottom: 8px;
`;

export const Cost = styled.div`
  color: rgb(251, 191, 36);
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 12px;
`;

// ----------------------------------------
// Tab Components
// ----------------------------------------
export const TabContainer = styled.div`
  display: fixed;
  position: sticky;
  top: 10px;
  gap: 1px;
  background-color: rgba(31, 41, 55, 0.8);
  padding: 4px;
  border-radius: 4px;
  margin-bottom: 10px;
  z-index: 1;
`;

export const TabButton = styled.button`
  padding: 12px 24px;
  color: ${props => props.$active ? 'white' : 'rgb(156, 163, 175)'};
  background-color: ${props => props.$active ? 'rgb(55, 65, 81)' : 'transparent'};
  border: none;
  border-radius: 2px;
  transition: all 0.2s;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

// ----------------------------------------
// Settings Components
// ----------------------------------------
export const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
`;

export const VolumeLabel = styled.span`
  min-width: 140px;
  color: white;
  font-size: 1.25rem;
`;

export const VolumeSlider = styled.input`
  flex: 1;
  height: 6px;
  appearance: none;
  background-color: rgb(55, 65, 81);
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
  }
`;

// ----------------------------------------
// PayTable Components
// ----------------------------------------
export const PayTableSection = styled.div`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  margin-top: 16px;
  color: rgb(251, 191, 36);
`;

export const SubSectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: bold;
  //text-align: center;
  margin-bottom: 8px;
  margin-top: px;
  color: rgb(251, 158, 36);
`;

export const PayTableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 5}, 1fr);
  gap: 16px;
  width: 100%;
  margin-bottom: 24px;
`;

export const SymbolCard = styled.div`
  //background-color: rgba(31, 41, 55, 0.8);
  //padding: 16px;
  //border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  //transition: transform 0.2s, box-shadow 0.2s;
`;

export const SymbolInfo = styled.div`
  width: 100%;
  text-align: center;
`;

// ----------------------------------------
// Message Components
// ----------------------------------------
export const getTypeColor = (type) => {
  switch (type) {
    case 'error': return 'rgb(239, 68, 68)';
    case 'success': return 'rgb(34, 197, 94)';
    case 'warning': return 'rgb(249, 115, 22)';
    default: return 'rgb(59, 130, 246)';
  }
};

export const MessageContainer = styled(FlexContainer)`
  max-width: 800px;
`;

export const MessageTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
  color: ${props => getTypeColor(props.$type)};
  margin-bottom: 1rem;
`;

// ----------------------------------------
// Bet Control Components
// ----------------------------------------
export const BetControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  //padding: 16px;
  //background-color: rgba(31, 41, 55, 0.2);
  border-radius: 6px;
  width: 100%;
  //max-width: 300px;
`;

export const BetLabel = styled.div`
  color: rgb(251, 191, 36);
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const BetControlWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const BetButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    color: rgb(251, 191, 36);
    //transform: scale(1.1);
  }
  
  &:disabled {
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
  }
`;

export const BetAmount = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: white;
  min-width: 100px;
  text-align: center;
`;