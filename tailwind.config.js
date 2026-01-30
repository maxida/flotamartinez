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
        },
        /* Brand palette for Flota Martinez - Taller Mecánico */
        brand: {
          dark: '#0f172a',      // sidebar dark navy
          primary: '#1e40af',   // intense blue for headings/borders
          accent: '#f97316',    // vibrant orange for actions/alerts
          bg: '#f1f5f9'         // very light gray background
        }
      }
    }
  },
  plugins: [],
}
