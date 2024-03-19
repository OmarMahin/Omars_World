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
        'fontColor' : '#1E1E1E',
        'secondaryColor' : '#1B1B1B'
      },
      fontFamily:{
        mainHeading: ['Josefin Sans'],
        subHeading: ['Langar'],
        mainFont: ['Istok Web'],
      },
      maxWidth: {
        conatiner: '1150px',
        '480B': '480px',
      },
    },
  },
  plugins: [],
}

