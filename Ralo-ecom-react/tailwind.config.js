 /** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
     extend: {
        colors: {
          "primary-color": "#5ec0f8",
          "secondary-color": "#fff",
     },
     animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
   },
   plugins: [],
 }
}