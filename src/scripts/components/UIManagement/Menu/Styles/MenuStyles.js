import * as baseStyles from './MenuStyles.base.js';
import * as desktopStyles from './MenuStyles.desktop.js';
import * as mobilePortraitStyles from './MenuStyles.mobilePortrait.js';
import * as mobileLandscapeStyles from './MenuStyles.mobileLandscape.js';

export const getMenuStyles = (version) => {
  switch (version) {
    case 'mobilePortrait':
      return { ...baseStyles, ...mobilePortraitStyles };
    case 'mobileLandscape':
      return { ...baseStyles, ...mobileLandscapeStyles };
    default:
      return { ...baseStyles, ...desktopStyles };
  }
};