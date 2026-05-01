/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        'brand-green': '#10b981',
        'brand-dark': '#050505',
      },
      boxShadow: {
        // Grover-style: profundo pero ultra-sutil
        'premium': '0 10px 40px -10px rgba(0,0,0,0.08)',
        // Para el Bottom Bar del modal
        'top-glow': '0 -8px 30px -4px rgba(0,0,0,0.06)',
        // Tarda para hover de tarjeta
        'card-hover': '0 20px 60px -15px rgba(0,0,0,0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        }
      }
    },
  },
  plugins: [],
}