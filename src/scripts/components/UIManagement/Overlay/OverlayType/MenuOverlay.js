import React, { useState } from 'react';
import { useScrollReset } from '../OverlayComponents/useScrollReset.js';
import BaseOverlay from '../BaseOverlay.js';
import PayTableContent from '../OverlayComponents/MenuComponents/PayTableContent.js';
import PayLinesContent from '../OverlayComponents/MenuComponents/PayLinesContent.js';
import BetControl from '../OverlayComponents/BetControl.js';
import RulesContent from '../OverlayComponents/MenuComponents/RulesContent.js';
import { useGameState } from '../../GameState/GameStateContext.js';
import {
  TabContainer,
  TabButton,
  FlexContainer,
  VolumeControl,
  VolumeLabel,
  VolumeSlider,
} from '../OverlayComponents/OverlayStyles.js';

const SettingsContent = () => {
  const { musicVolume, soundVolume, setMusicVolume, setSoundVolume } = useGameState();
  
  return (
    <div style={{ marginTop: '60px'}}>
      <VolumeControl>
        <VolumeLabel>Music</VolumeLabel>
        <VolumeSlider
          type="range"
          min="0"
          max="100"
          value={musicVolume}
          onChange={(e) => setMusicVolume(parseInt(e.target.value))}
        />
      </VolumeControl>
      <VolumeControl>
        <VolumeLabel>Sounds</VolumeLabel>
        <VolumeSlider
          type="range"
          min="0"
          max="100"
          value={soundVolume}
          onChange={(e) => setSoundVolume(parseInt(e.target.value))}
        />
      </VolumeControl>
    </div>
  );
};

// Factory pour les composants
const MENU_COMPONENTS = {
  PayTableContent: PayTableContent,
  PayLinesContent: PayLinesContent,
  RulesContent: RulesContent,
  SettingsContent: SettingsContent
};

// Composant principal MenuOverlay
const MenuOverlay = ({ onClose }) => {
  const { uiConfig } = useGameState();
  
  const tabs = uiConfig?.overlay?.GAME_MENU?.config?.tabs || [];
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'paytable');

  useScrollReset(activeTab);

  const renderContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab) return null;

    const Component = MENU_COMPONENTS[currentTab.component];
    if (!Component) {
      console.warn(`Component ${currentTab.component} not found`);
      return <div>Component not found: {currentTab.component}</div>;
    }

    const content = [];

    // Ajouter BetControl si configuré
    if (currentTab.showBetControl) {
      content.push(
        <BetControl 
          key="bet-control"
          customLabel="ACTUAL BET" 
        />
      );
    }

    // Ajouter le composant principal
    content.push(<Component key={currentTab.id} />);

    return content;
  };

  return (
    <BaseOverlay onClose={onClose} contentType="menu">
      <FlexContainer $maxWidth="1200px">
        <TabContainer>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabContainer>
        {renderContent()}
      </FlexContainer>
    </BaseOverlay>
  );
};

export default MenuOverlay;