import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // architecture-ready; not activated yet
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          secondary: '#4F46E5',
          accent: '#DBEAFE',
        },
        surface: {
          background: '#FFFFFF',
          DEFAULT: '#F8FAFC',
          card: '#F1F5F9',
          border: '#CBD5E1',
          divider: '#E2E8F0',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        semantic: {
          success: '#16A34A',
          warning: '#D97706',
          error: '#DC2626',
          info: '#0284C7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // 8px baseline system, extending Tailwind's default scale
        18: '4.5rem',
      },
      borderRadius: {
        xl: '0.875rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15, 23, 42, 0.06)',
        card: '0 4px 16px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
