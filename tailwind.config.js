/** @type {import('tailwindcss').Config} */
module.exports = {  
  content: [   
        "./src/pages/**/*.{js,ts,jsx,tsx}",   
        "./src/components/**/*.{js,ts,jsx,tsx}",  
         ],
  theme: {   
       extend: {},
       textColor: theme => theme('colors'),
       textColor: { 
              'primary': '#6200FF',
              'accent-1': '#8F5CFF' 
       }
  },  
  plugins: [],
}