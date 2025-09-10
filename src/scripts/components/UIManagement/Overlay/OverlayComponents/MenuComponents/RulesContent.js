import React from 'react';
import styled from 'styled-components';
import { UIAssetsManager } from '../../../UIAssetsManager.js';
import {
  Text,
  SectionTitle,
  SubSectionTitle
} from '../OverlayStyles.js';

const SymbolContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 30px;
  width: 100%;
`;

const SpecialSymbolImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  flex-shrink: 0;
`;

const CrownImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  flex-shrink: 0;
`;

const ScatterSymbolImage = styled.img`
  width: 140px;
  height: 140px;
  object-fit: contain;
  flex-shrink: 0;
`;

const SymbolText = styled(Text)`
  text-align: left;
  flex: 1;
`;

const RulesContent = () => {
    return (
        <div>
            <SectionTitle>ABOUT THE GAME</SectionTitle>
            <Text>
            This is a 5-reel, 4-row game, with free respins every time at least one special symbol lands.
            4 special symbols are present in the game, they have an effect on the future free spins gained: adding wilds, multis, crowns to symbols, or removing the weakest symbols.
            At each position where a special symbol lands, a permanent wild is added for the future free spins.
            The symbol panel represents the setup of the game and the upgrades that will take place during the next free spins.
            Build the ultimate setup with big multipliers, high paying symbols and lots of wilds to trigger big wins!<br /><br />
            </Text>

            <SectionTitle>SPECIAL SYMBOLS</SectionTitle>
            <Text>
            Special symbols can only appears on the 3 middle reels.
            Every time at least one special symbol lands, you win a free spin with the upgrades present in the symbol panel.<br />
            at each position where a special symbol lands, a burning square si added, representing the location of permanent wilds that will be added during free spins <br />
            If two ore more special Symbols lands in a single spin, only 1 free spin is won.<br />
            At each free spin, if at least one special symbol lands, you win another free spin.
            </Text>

            <SymbolContainer>
                <SpecialSymbolImage 
                    src={UIAssetsManager.getImageSrc('symbols-special_wild')}
                    alt="Deer Symbol"
                />
                <SymbolText>
                    <b>Add 2 or 3 permanent wilds to the grid.</b> <br />
                    The maximum number of wilds possible in the symbol panel is 12 (4 by reel, on the 3 middle reels).
                </SymbolText>
            </SymbolContainer>

            <SymbolContainer>
                <SpecialSymbolImage 
                    src={UIAssetsManager.getImageSrc('symbols-special_multi')}
                    alt="God Symbol"
                />
                <SymbolText>
                    <b>Add between 3 and 5 multipliers on the symbols in the symbolPanel</b>, randomly distributed among the available symbols (except wild).<br />
                    The affected symbols will have these multipliers attached to them during the next free spins. <br />
                    If a valid payline contains a symbols with a multiplier attached, then the win is multiplied by the number displayed next to the concerned symbol in the grid.<br />
                    When triggering the special symbol, the possible multipliers are: <br /> 2x, 3x, 4x, 5x, 10x, 20x.
                </SymbolText>
            </SymbolContainer>

            <SymbolContainer>
                <SpecialSymbolImage 
                    src={UIAssetsManager.getImageSrc('symbols-special_remove')}
                    alt="Howl Symbol"
                />
                <SymbolText>
                    <b>Remove between 1 and 3 symbols in the symbolPanel.</b><br />
                    Symbols are removed from the lowest paying to the highest paying.<br />
                    The next free spins will no longer contain this symbols.<br />
                    If a removed symbol had a multiplier or a crown attached to it, then it is sent to a new available symbol in the symbol panel, chosen randomly.<br />
                    Multipliers and crowns moved in this way do not trigger the actions of the crowns in the symbolPanel <br />
                </SymbolText>
            </SymbolContainer>

            <SymbolContainer>
                <SpecialSymbolImage 
                    src={UIAssetsManager.getImageSrc('symbols-special_crown')}
                    alt="Howl Symbol"
                />
                <SymbolText>
                    <b>Add a crown on a random symbol in the symbolPanel.</b><br />
                    The first time this special symbol lands during a spin or a bonus, it adds 2 additional permanents wilds to the grid.<br />
                    Each type of crown can only appear once during a spin or bonus.<br />
                    Crowns have special abilities that activate when assigned to a symbol and throughout Free Spins (look below for capabilities).<br />
                    Crown abilities can be stacked together to form large setups.<br />
                    <b>Special case:</b> When the "spreading" crown and the "copying" crown activate together, the effects are cumulative, but the spreading and copying effect can only activate once.<br />
                </SymbolText>
            </SymbolContainer>

            <SymbolContainer>
                <ScatterSymbolImage 
                    src='/assets/images/symbols/Scatter_162.png'
                    alt="Scatter Symbol"
                />
                <SymbolText>
                    Land 3 or more scatter symbols triggers a bonus game.<br />
                    If scatter symbols land on a spin while a free respin is won in base game, they are stored on the side of the grid, giving extra chances to win a bonus if other scatter symbols land during free respins.
                </SymbolText>
            </SymbolContainer>

            <SectionTitle>CROWNS</SectionTitle>
            
            <SymbolContainer>
                <CrownImage 
                    src={UIAssetsManager.getImageSrc('symbols-crown_add')}
                    alt="crown_add"
                />
                <SymbolText>
                    <b>When the crown is assigned:</b> nothing.<br />
                    <b>During the rest of the game:</b> Adds a 12x multiplier to the symbol at the end of each spin.
                </SymbolText>
            </SymbolContainer>

            <SymbolContainer>
                <CrownImage 
                    src={UIAssetsManager.getImageSrc('symbols-crown_spread')}
                    alt="crown_spread"
                />
                <SymbolText>
                    <b>When the crown is assigned:</b> Adds a 2x multiplier to the symbol, then spreads the current total multiplier to all other symbols.<br />
                    <b>During the rest of the game:</b> Each time a multiplier is added to the symbol with this crown, it spreads the value of the multiplier to all other symbols.
                </SymbolText>
            </SymbolContainer>

            <SymbolContainer>
                <CrownImage 
                    src={UIAssetsManager.getImageSrc('symbols-crown_copy')}
                    alt="crown_copy"
                />
                <SymbolText>
                    <b>When the crown is assigned:</b> Adds a 10x multiplier to another random symbol, tthen copies all multipliers from other symbols.<br />
                    <b>During the rest of the game:</b> Each time a multiplier is added to another symbol, it copies the value of the multiplier.
                </SymbolText>
            </SymbolContainer>

            <SymbolContainer>
                <CrownImage 
                    src={UIAssetsManager.getImageSrc('symbols-crown_moveAndAdd')}
                    alt="crown_moveAndAdd"
                />
                <SymbolText>
                    <b>When the crown is assigned:</b> Adds a 10x multiplier to the symbol.<br />
                    <b>During the rest of the game:</b> At the end of each spin, the crown moves to another symbol, then adds a 10x multiplier to this symbol.
                </SymbolText>
            </SymbolContainer>

            <SymbolContainer>
                <CrownImage 
                    src={UIAssetsManager.getImageSrc('symbols-crown_multiply')}
                    alt="crown_multiply"
                />
                <SymbolText>
                    <b>When the crown is assigned:</b> Adds a 5x multiplier to the symbol, then multiplies its total multiplier by 5<br />
                    <b>During the rest of the game:</b> Each time a multiplier is added to the symbol with this crown, it multiplies the value of this multiplier by 5.
                </SymbolText>
            </SymbolContainer>

            <SectionTitle>FEATURES</SectionTitle>

            <SubSectionTitle>BONUS HUNT</SubSectionTitle>
            <SymbolText>
            <b>QUINTUPLE CHANCE:</b> Costs 3 times the actual bet. Each spin is 5 times more likely to trigger a Bonus Game. Chances to trigger a bigger bonus are also increased<br /><br />
            </SymbolText>

            <SubSectionTitle>FEATURES</SubSectionTitle>
            <SymbolText>
            <b>SUPER SPIN:</b> Costs 30 times the actual bet. Each super spin guarantees that at least 1 special symbol land, 3 times in a row.<br /><br />
            </SymbolText>

            <SubSectionTitle>BONUS</SubSectionTitle>
            <SymbolText>
            <b>BONUS (3 Scatters):</b> Costs 100 times the actual bet. Throughout the bonus, Symbol panel upgrades and wilds are permanent.<br/>
            If at least one special symbol lands during a spin, you win an additional free spin.<br /><br />
            </SymbolText>

            <SymbolText>
            <b>SUPER BONUS (4 Scatters):</b> Costs 250 times the actual bet. Throughout the bonus, Symbol panel upgrades and wilds are permanent.<br/>
            If at least one special symbol lands during a spin, you win an additional free spin.<br />
            Chances of getting crowns during the bonus are increased.<br /><br />
            </SymbolText>

            <SectionTitle>GENERAL INFORMATIONS</SectionTitle>

            <SymbolText>The max win is 10 000 times the actual bet.</SymbolText>
            <SymbolText>The hit rate in base game is 0.28%.</SymbolText>

            <SubSectionTitle>RTP</SubSectionTitle>
            <SymbolText>
            <b>base game:</b> 96.1 % <br />
            <b>quintuple chance:</b> 96.2 % <br />
            <b>super spin:</b> 96.3 % <br />
            <b>bonus:</b> 96.4 % <br />
            <b>superBonus:</b> 96.4 % <br /><br />
            RTPs are calculated over a few million spins, so the real RTP may vary a little.<br />
            </SymbolText>
        </div>
    );
};

export default RulesContent;