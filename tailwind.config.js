/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'backgroundColor' : '#EDE8E8',
        'secondaryBackgroundColor': '#D1CDCD',
        'fontColor' : '#1E1E1E',
        'secondaryColor' : '#1B1B1B',
        'lightFontColor' : '#3C3C3C'
      },
      fontFamily:{
        mainHeading: ['Josefin Sans'],
        subHeading: ['Langar'],
        mainFont: ['Istok Web'],
      },
      maxWidth: {
        conatiner: '1024px',
        '480B': '480px',
      },

      screens: {
        '480B': '480px',
      }
    },
  },
  plugins: [],
}

