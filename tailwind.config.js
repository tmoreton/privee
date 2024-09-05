/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'regular': ["JosefinSans-Regular"],
        'bold': ["JosefinSans-Bold"],
        'semibold': ["JosefinSans-SemiBold"],
        'medium': ["JosefinSans-Medium"],
        'light': ["JosefinSans-Light"],
      },
    },
  },
  plugins: [],
}

