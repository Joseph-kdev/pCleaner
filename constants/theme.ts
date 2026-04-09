import { Platform } from 'react-native';

const brandOrange = '#F97316'; // Vivid orange for brand accents

export const Colors = {
  light: {
    text: '#09090B', // Very dark zinc
    textSecondary: '#71717A',
    background: '#FAFAFA', // Slight off-white, premium look
    surface: '#FFFFFF',
    brand: brandOrange,
    tint: brandOrange,
    icon: '#71717A',
    tabIconDefault: '#A1A1AA',
    tabIconSelected: brandOrange,
    border: '#E4E4E7',
    error: '#EF4444',
  },
  dark: {
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    background: '#09090B', // Near true-black
    surface: '#18181B', // Slightly lighter for cards
    brand: brandOrange,
    tint: brandOrange,
    icon: '#A1A1AA',
    tabIconDefault: '#71717A',
    tabIconSelected: brandOrange,
    border: '#27272A',
    error: '#EF4444',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
