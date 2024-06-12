/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      
        colors: {
          brand: {
            primary: '#EF9C66',
            secondary: '#FCDC94',
            tertiary: '#C8CFA0',
            quaternary: '#78ABA8',
          },
        },


    },
  },
  plugins: [],
}
