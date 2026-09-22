/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // === Primary ===
        primary: {
          DEFAULT: '#00c9a7',
          dark: '#00b894',
          light: '#55efc4',
          50: '#e6fdf8',
          100: '#b3f7e9',
          200: '#80f1da',
          300: '#4debcb',
          400: '#1ae5bc',
          500: '#00c9a7',
          600: '#00b894',
          700: '#009e7e',
          800: '#008468',
          900: '#006a52',
        },
        // === Secondary ===
        secondary: {
          DEFAULT: '#f39c12',
          dark: '#e67e22',
          light: '#f1c40f',
        },
        // === Accent (Pink/Magenta) ===
        accent: {
          DEFAULT: '#e84393',
          dark: '#c0246e',
          light: '#ff6bb5',
        },
        // === Neutrals ===
        background: '#f0f4f8',
        surface: '#ffffff',
        border: '#e2e8f0',
        // === Text ===
        text: {
          primary: '#1a1a2e',
          secondary: '#64748b',
          muted: '#94a3b8',
          inverse: '#ffffff',
        },
        // === Semantic ===
        success: '#00c9a7',
        warning: '#f39c12',
        error: '#e84393',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.12)',
        primary: '0 4px 16px rgba(0,201,167,0.35)',
        secondary: '0 4px 16px rgba(243,156,18,0.35)',
        accent: '0 4px 16px rgba(232,67,147,0.35)',
      },
    },
  },
  plugins: [],
};
