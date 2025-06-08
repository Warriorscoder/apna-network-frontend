/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        // Exact colors from screenshots
        "apna-purple": "#8B7EC8",
        "apna-purple-light": "#B8B0E8",
        "apna-purple-dark": "#6B5B9C",
        "apna-orange": "#FF8C42",
        "apna-gray": "#4A4A4A",
        "apna-light-gray": "#F5F5F5",
        "apna-bg": "#E8E4F5",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #E8E4F5 0%, #D8D1E9 50%, #C8BFDD 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
