/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14151A",
        surface: "#1C1E26",
        raised: "#23252F",
        line: "#31333F",
        muted: "#8B8D98",
        offwhite: "#EDEDEF",
        xp: "#6FCF63",
        danger: "#EF5D5D",
        track: {
          c: "#F2A65A",
          cpp: "#6C8CFF",
          python: "#F5C242",
          java: "#E2725B",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
