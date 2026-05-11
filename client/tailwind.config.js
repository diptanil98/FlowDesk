/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        danger: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
          700: '#B91C1C',
        },
        success: {
          DEFAULT: '#16A34A',
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#D97706',
          700: '#B45309',
        },
        // Custom theme colors
        background: '#F8FAFC',
        sidebar: '#FFFFFF',
        text: '#1E293B',
        'text-subtle': '#64748B',
        border: '#E2E8F0',
        // Status colors
        'status-todo': '#F1F5F9',
        'status-todo-text': '#64748B',
        'status-in-progress': '#DBEAFE',
        'status-in-progress-text': '#2563EB',
        'status-in-review': '#FEF3C7',
        'status-in-review-text': '#D97706',
        'status-done': '#DCFCE7',
        'status-done-text': '#16A34A',
        // Priority colors
        'priority-low': '#F0FDF4',
        'priority-low-text': '#16A34A',
        'priority-medium': '#FEF3C7',
        'priority-medium-text': '#D97706',
        'priority-high': '#FED7D7',
        'priority-high-text': '#DC2626',
        'priority-urgent': '#FEE2E2',
        'priority-urgent-text': '#B91C1C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        'pill': '9999px',
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
}