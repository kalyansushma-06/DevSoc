/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        void: {
          900: "#05050a",
          800: "#0a0a14",
          700: "#0f0f1e",
          600: "#15152b"
        },
        nova: {
          purple: "#7c3aed",
          violet: "#8b5cf6",
          cyan: "#22d3ee",
          teal: "#2dd4bf",
          pink: "#ec4899"
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "nova-gradient": "linear-gradient(135deg, #7c3aed 0%, #6366f1 35%, #22d3ee 100%)",
        "nova-radial": "radial-gradient(ellipse at top, rgba(124,58,237,0.25), transparent 60%)"
      },
      boxShadow: {
        glow: "0 0 40px rgba(139,92,246,0.35)",
        "glow-cyan": "0 0 40px rgba(34,211,238,0.3)"
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-12px) translateX(6px)" },
          "100%": { transform: "translateY(0px) translateX(0px)" }
        },
        twinkle: {
          "0%,100%": { opacity: 0.25 },
          "50%": { opacity: 1 }
        }
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
