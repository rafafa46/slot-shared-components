import React from 'react';
import styled from 'styled-components';
import { UIAssetsManager } from '../../../UIAssetsManager.js';
import { useGameState } from '../../../GameState/GameStateContext.js';
import {
  Text,
  SectionTitle,
  SubSectionTitle
} from '../OverlayStyles.js';

const ImageAndTextContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 30px;
  width: 100%;
`;

const Image = styled.img`
  width: ${props => props.$size || '120px'};
  height: ${props => props.$size || '120px'};
  object-fit: contain;
  flex-shrink: 0;
`;

const AlignedText = styled(Text)`
  text-align: left;
  flex: 1;
`;

const RulesContent = () => {
  const { uiConfig } = useGameState();

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'SectionTitle':
        return <SectionTitle key={index}>{section.text}</SectionTitle>;
      
      case 'SubSectionTitle':
        return <SubSectionTitle key={index}>{section.text}</SubSectionTitle>;
      
      case 'text':
        return (
          <AlignedText key={index} dangerouslySetInnerHTML={{ __html: section.text }} />
        );
      
      case 'imageAndText':
        return (
          <ImageAndTextContainer key={index}>
            <Image 
              src={UIAssetsManager.getImageSrc(section.image)}
              alt={section.image}
              $size={section.imageSize}
            />
            <AlignedText dangerouslySetInnerHTML={{ __html: section.text }} />
          </ImageAndTextContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      {uiConfig.rules.sections.map((section, index) => renderSection(section, index))}
    </div>
  );
};

export default RulesContent;