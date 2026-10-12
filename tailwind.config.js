/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayacucho: {
          night: '#082A4A',       // Azul noche
          deep: '#0D3B66',        // Azul profundo
          gold: '#D8A64C',        // Dorado turístico
          lightgold: '#F2D493',   // Dorado claro
          warmwhite: '#FAF8F3',   // Blanco cálido
          bg: '#F4F6F8',          // Gris de fondo
          success: '#16865B',     // Verde confirmación
          alert: '#CB3A3A',       // Rojo alerta
          accent: '#E65100',      // Acento andino teja
          surface: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        cultural: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(8, 42, 74, 0.08)',
        'elevated': '0 10px 30px -4px rgba(8, 42, 74, 0.12)',
        'modal': '0 20px 40px -8px rgba(8, 42, 74, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
