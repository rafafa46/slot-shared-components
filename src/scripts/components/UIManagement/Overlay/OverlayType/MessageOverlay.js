import React from 'react';
import BaseOverlay from '../BaseOverlay.js';
import {
  MessageContainer,
  MessageTitle,
  Text
} from '../OverlayComponents/OverlayStyles.js';

const MessageOverlay = ({ onClose, title, message, type = 'info' }) => (
  <BaseOverlay onClose={onClose} contentType="message">
    <MessageContainer>
      <MessageTitle $type={type}>
        {title}
      </MessageTitle>
      <Text>
        {message}
      </Text>
    </MessageContainer>
  </BaseOverlay>
);

export default MessageOverlay;