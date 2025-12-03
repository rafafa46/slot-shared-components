import React from 'react';
import { useOverlay } from './OverlayContext.js';
import { X } from "@phosphor-icons/react";
import {
  OverlayWrapper,
  ContentContainer,
  CloseButton
} from './OverlayComponents/OverlayStyles.js';

const BaseOverlay = ({ 
  children, 
  onClose, 
  onAction,
  overlayType = 'modal',
  contentType = 'default',
  className = '' 
}) => {
  const { hasPointerEvents } = useOverlay();
  
  // Gestion des clics pour les overlays de type clickable
  const handleClick = () => {
    if (overlayType === 'clickable') {
      if (onAction) {
        onAction();
      } else if (onClose) {
        onClose();
      }
    }
  };
  
  return (
    <OverlayWrapper
      $hasPointerEvents={hasPointerEvents}
      onClick={overlayType === 'clickable' ? handleClick : undefined}
    >
      <ContentContainer
        data-overlay-content
        $customStyles={className}
        onClick={overlayType === 'clickable' ? undefined : e => e.stopPropagation()}
      >
        {overlayType !== 'clickable' && (
        <CloseButton
          onClick={onClose}
          aria-label="Close"
        >
          <X size={34} weight="bold" />
        </CloseButton>
      )}
        {children}
      </ContentContainer>
    </OverlayWrapper>
  );
};

export default BaseOverlay;