/** @type {import('tailwindcss').Config} */
import animate from 'tw-animate-css'
import forms from '@tailwindcss/forms'
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.129 0.042 264.695)',
        // Add your custom CSS variables here if needed
      }
    }
  },
  darkMode: 'class',
  plugins: [animate,forms],
}
