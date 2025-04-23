import { createTheme } from './codemirror.theme';

export default () =>
  createTheme({
    theme: 'light',
    settings: {
      background: '#fff',
      foreground: '#000',
      caret: '#000',
      selection: '#c2d2ff',
      selectionMatch: '#b1c1ef',
      gutterBackground: '#fff',
      gutterForeground: '#ada9a9',
      gutterActiveForeground: '#000',
      lineHighlight: '#c7c5c575',
    },
    styles: [],
  });
