/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D1117",
        surface: "#161B27",
        raised: "#1E2435",
        line: "#2A3145",
        muted: "#8892A4",
        offwhite: "#E8EDF5",
        xp: "#5CB85C",
        danger: "#E05252",
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
