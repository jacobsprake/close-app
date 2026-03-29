// CLOSE App Design System
export const Brand = {
  blue: '#4A7CFF',       // Trust blue — primary
  orange: '#FF6B35',     // Warmth orange — notifications/alerts
  background: '#F8F9FC', // Cool light
  dark: '#0D1117',       // Dark mode base
  textSecondary: '#8B8FA3',
  card: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.06)',
  success: '#34C759',
  warning: '#FFB800',
  fading: '#FFB347',     // Amber fading indicator
  danger: '#FF3B30',
  border: '#E8EAF0',
};

const tintColorLight = Brand.blue;
const tintColorDark = '#FFFFFF';

export default {
  light: {
    text: Brand.dark,
    background: Brand.background,
    tint: tintColorLight,
    tabIconDefault: Brand.textSecondary,
    tabIconSelected: tintColorLight,
    card: Brand.card,
    border: Brand.border,
  },
  dark: {
    text: '#FFFFFF',
    background: Brand.dark,
    tint: tintColorDark,
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    card: '#1C2333',
    border: '#2D3548',
  },
};
