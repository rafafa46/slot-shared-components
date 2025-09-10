import React from 'react';
import { useGameState } from '../../GameState/GameStateContext.js';
import { formatCurrency } from '../../currencyFormatter.js'
import { PlusCircle, MinusCircle } from "@phosphor-icons/react";
import {
  BetControlContainer,
  BetLabel,
  BetControlWrapper,
  BetButton,
  BetAmount
} from './OverlayStyles.js';

const BetControl = ({ customLabel }) => {
  const { currentBet, changeBet, isButtonDisabled } = useGameState();
  
  return (
    <BetControlContainer>
      <BetLabel>{customLabel || "BET"}</BetLabel>
      <BetControlWrapper>
        <BetButton 
          onClick={() => changeBet('down')}
          disabled={isButtonDisabled('betChange')}
        >
          <MinusCircle size={32} />
        </BetButton>
        <BetAmount>{formatCurrency(currentBet)}</BetAmount>
        <BetButton 
          onClick={() => changeBet('up')}
          disabled={isButtonDisabled('betChange')}
        >
          <PlusCircle size={32} />
        </BetButton>
      </BetControlWrapper>
    </BetControlContainer>
  );
};

export default BetControl;