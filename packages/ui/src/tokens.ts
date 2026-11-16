/** Design tokens for Carbon Department (Editorial Workshop System) */

export const colors = {
  bg: '#0F0F10',
  surface: '#161617',
  'surface-raised': '#1F1F21',
  text: '#F2F2F0',
  'text-secondary': '#9A9A9A',
  cyan: '#00B8F0',
  'cyan-hover': '#38C5F5',
  border: 'rgba(255, 255, 255, 0.08)',
  'border-hover': 'rgba(255, 255, 255, 0.16)',
  success: '#2DD4A0',
  danger: '#FF5D6C',
  warning: '#FF9F5A',
} as const;

export const fonts = {
  heading: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const glassStyle = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
};
