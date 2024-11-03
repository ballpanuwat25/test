/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      {
        cream: {
          "primary": "#1a1a1a",
                    
          "primary-content": "#cbcbcb",
                    
          "secondary": "#404040",
                    
          "secondary-content": "#d5d5d5",
                    
          "accent": "#53c653",
                    
          "accent-content": "#020e02",
                    
          "neutral": "#000809",
                    
          "neutral-content": "#c2c6c7",
                    
          "base-100": "#ffefcc",
                    
          "base-200": "#ded0b1",
                    
          "base-300": "#beb197",
                    
          "base-content": "#16140f",
                    
          "info": "#3333",
                    
          "info-content": "#d2d2d2",
                    
          "success": "#39ac39",
                    
          "success-content": "#010b01",
                    
          "warning": "#ff5c33",
                    
          "warning-content": "#160301",
                    
          "error": "#ff1a1a",
                    
          "error-content": "#160000",
        },
      }
    ],
  },
}

