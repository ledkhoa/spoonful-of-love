/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary: Warm Coral (nurturing, appetizing, maternal)
        primary: {
          50: '#fef7f0',
          100: '#fdeee1',
          200: '#fad9c2',
          300: '#f7bf9e',
          400: '#f29d78',
          500: '#ed7d5b', // Main primary - warm coral
          600: '#e85d3a',
          700: '#d4442a',
          800: '#b03725',
          900: '#8f2f23',
        },
        // Secondary: Ocean Teal (fresh, clean, playful contrast)
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Main secondary - ocean teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Accent: Sage Green (natural, healthy, organic)
        accent: {
          50: '#f6faf7',
          100: '#e9f4eb',
          200: '#d4e8d7',
          300: '#b6d5bb',
          400: '#8fbf96',
          500: '#6ea575', // Main accent - sage green
          600: '#578a5e',
          700: '#487050',
          800: '#3c5a42',
          900: '#334a37',
        },
        // Sunshine: Warm Yellow (happy, energetic, toddler-friendly)
        sunshine: {
          50: '#fffef5',
          100: '#fffce8',
          200: '#fff7c5',
          300: '#ffef98',
          400: '#ffe05e',
          500: '#ffcd2b', // Main sunshine yellow
          600: '#f0b519',
          700: '#cc9314',
          800: '#a47217',
          900: '#875e18',
        },
        // Lavender: Soft Purple (calming, premium, sophisticated)
        lavender: {
          50: '#faf8ff',
          100: '#f4f0fe',
          200: '#ebe4fd',
          300: '#ddd0fb',
          400: '#c9b3f7',
          500: '#b492f0', // Main lavender
          600: '#9d6fe6',
          700: '#8855d3',
          800: '#7046b0',
          900: '#5c3c8f',
        },
        // Cream: Warm Neutral (clean, premium, sophisticated)
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf2e4',
          300: '#f5e6ca',
          400: '#eed5a3',
          500: '#e4c078', // Main cream
          600: '#d4a853',
          700: '#b8913c',
          800: '#957533',
          900: '#78602d',
        },
        // Neutral: Warm Grays (readable, professional)
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f3',
          200: '#e7e7e4',
          300: '#d4d4d0',
          400: '#a8a8a3',
          500: '#7c7c77',
          600: '#5f5f5a',
          700: '#4a4a46',
          800: '#3d3d39',
          900: '#2f2f2c',
        },
        // Success: Fresh Green (healthy eating, achievements)
        success: {
          50: '#f1fdf3',
          100: '#dffbe5',
          200: '#c1f5cc',
          300: '#93eba4',
          400: '#5dd874',
          500: '#34c249', // Main success green
          600: '#239f35',
          700: '#1e7e2d',
          800: '#1d6428',
          900: '#1a5324',
        },
        // Warning: Warm Orange (alerts, tips, caution)
        warning: {
          50: '#fff9eb',
          100: '#fef0c7',
          200: '#fedf8a',
          300: '#fdc84d',
          400: '#fcb123',
          500: '#f59e0b', // Main warning orange
          600: '#dc7a06',
          700: '#b8590a',
          800: '#95460f',
          900: '#7a3a10',
        },
        // Error: Soft Red (gentle alerts, not scary for moms)
        error: {
          50: '#fef4f2',
          100: '#fde7e3',
          200: '#fbd3cc',
          300: '#f7b5a8',
          400: '#f18b76',
          500: '#e8664c', // Main error - soft red
          600: '#d54c32',
          700: '#b33d26',
          800: '#943424',
          900: '#7b2f25',
        },
      },
    },
  },
  plugins: [],
};
