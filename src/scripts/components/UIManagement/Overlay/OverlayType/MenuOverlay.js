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

// Composant principal MenuOverlay
const MenuOverlay = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('paytable');

  useScrollReset(activeTab);

  const tabs = [
    { id: 'paytable', label: 'Paytable' },
    { id: 'paylines', label: 'Paylines' },
    { id: 'rules', label: 'Rules' },
    { id: 'settings', label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'paytable':
        return (
          <>
            <BetControl customLabel="ACTUAL BET" />
            <PayTableContent />
          </>
        );
      case 'paylines':
        return <PayLinesContent />;
      case 'rules':
        return <RulesContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return null;
    }
  };

  return (
    <BaseOverlay onClose={onClose} contentType="menu">
      <FlexContainer $maxWidth="900px">
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