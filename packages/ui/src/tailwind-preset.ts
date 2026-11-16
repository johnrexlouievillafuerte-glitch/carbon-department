/**
 * Tailwind CSS v4 compatible preset for Carbon Department.
 *
 * Import this preset in your app's tailwind config:
 *
 * @example
 * import carbonPreset from '@carbon/ui/src/tailwind-preset';
 * export default { presets: [carbonPreset] };
 */

import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const carbonPreset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        carbon: '#07090E',
        'navy-surface': '#111A33',
        'navy-raised': '#172544',
        azure: {
          DEFAULT: '#00C2FF',
          hover: '#38BDF8',
          light: '#7DD3FC',
        },
        cyan: {
          DEFAULT: '#00C2FF',
          hover: '#38BDF8',
          light: '#7DD3FC',
        },
        magenta: {
          DEFAULT: '#FF2E93',
          hover: '#F43F5E',
          light: '#FDA4AF',
        },
        success: '#2DD4A0',
        danger: '#FF5D6C',
        warning: '#FF9F5A',
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          hover: 'rgba(255,255,255,0.15)',
        },
        glass: {
          DEFAULT: 'rgba(23,43,87,0.45)',
          border: 'rgba(255,255,255,0.08)',
        },
        text: {
          DEFAULT: '#EAF0FA',
          muted: '#A3B1C8',
        },
      },
      fontFamily: {
        heading: ["'Poppins'", 'sans-serif'],
        body: ["'Jost'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      maxWidth: {
        content: '1200px',
        text: '65ch',
      },
      letterSpacing: {
        heading: '-0.01em',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        /**
         * Glassmorphism card — use ONLY for nav, modals, hero card.
         */
        '.glass': {
          background: 'rgba(23,43,87,0.45)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.08)',
        },

        /**
         * Diagonal corner clip — use for hero/modals ONLY.
         * Cuts a 24px triangle off the top-right corner.
         */
        '.clip-brand': {
          clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)',
        },
      });
    }),
  ],
};

export default carbonPreset;
