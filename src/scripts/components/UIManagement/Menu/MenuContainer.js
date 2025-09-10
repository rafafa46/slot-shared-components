import React, { useRef } from 'react';
import Menu from './Menu.js';

const MenuContainer = ({ version, onBuyFeatureClick, onMenuClick }) => {  
  return (
    <div>
      <Menu
        version={version}
        onBuyFeatureClick={onBuyFeatureClick}
        onMenuClick={onMenuClick}
      />
    </div>
  );
};

export default React.memo(MenuContainer);