module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5'
        },
        success: {
          DEFAULT: '#10b981'
        },
        accent: {
          indigo: '#4f46e5',
          emerald: '#10b981'
        },
        slate: {
          50: '#f8fafc',
          900: '#0f172a'
        },
        danger: {
          DEFAULT: '#ef4444'
        },
        warn: {
          DEFAULT: '#f59e0b'
        }
      }
    }
  },
  plugins: [],
}
