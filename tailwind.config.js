import animate from 'tailwindcss-animate';

/**
 * Every color comes from a CSS variable in src/styles/tokens.css.
 * `rgb(var(--x) / <alpha-value>)` keeps opacity modifiers (bg-primary/10) working.
 */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', desktop: '1201px', xl: '1280px', '2xl': '1536px' },
    extend: {
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        surface: { DEFAULT: token('surface'), muted: token('surface-muted') },
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        overlay: token('overlay'),
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
          foreground: token('primary-foreground'),
        },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        destructive: { DEFAULT: token('destructive'), foreground: token('destructive-foreground') },
        success: { DEFAULT: token('success'), soft: token('success-soft') },
        warning: { DEFAULT: token('warning'), soft: token('warning-soft') },
        danger: { DEFAULT: token('danger'), soft: token('danger-soft') },
        notice: token('notice'),
        whatsapp: { DEFAULT: token('whatsapp'), hover: token('whatsapp-hover') },
        neutral: { DEFAULT: token('neutral'), soft: token('neutral-soft') },
        sidebar: {
          DEFAULT: token('sidebar'),
          hover: token('sidebar-hover'),
          dark: token('sidebar-dark'),
          foreground: token('sidebar-foreground'),
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        card: 'var(--radius-card)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      maxWidth: {
        'dialog-sm': '24rem',
        'dialog-md': '32rem',
        'dialog-lg': '48rem',
        'auth-card': '36rem',
      },
      fontFamily: { sans: ['Tajawal', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [animate],
};
