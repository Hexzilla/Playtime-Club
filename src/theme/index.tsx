import { createTheme as createMuiTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';
import { baseThemeOptions } from './base-theme-options';
import { darkThemeOptions } from './dark-theme-options';
import { lightThemeOptions } from './light-theme-options';

export const createTheme = (config: any) => {
  let theme = createMuiTheme(baseThemeOptions as ThemeOptions,
    config.mode === 'dark' ? darkThemeOptions : lightThemeOptions,
    {
      direction: config.direction
    });

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
