import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import lineClamp from "@tailwindcss/line-clamp";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
      },
    },
  },

  safelist: [{
    pattern: /text-.+/,
  }, {
    pattern: /justify(-.+)+/,
  }, { pattern: /w-.+/ }],

  presets: [
    forms(),
    typography(),
    aspectRatio,
    lineClamp,
  ],

  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        "input:focus": {
          "@apply outline-none": {},
        },
      });
    }),

    plugin((api) => {
      api.matchUtilities({
        // deno-lint-ignore no-explicit-any
        ".basis": (parts: any) => {
          let value;
          const arr = parts[0].split("/");

          if (arr.length === 2) {
            value = `${(+arr[0] / +arr[1]) * 100}%`;
          } else if (parts.length === 1) {
            value = parts[0];
          }

          return {
            "flex-basis": value,
          };
        },
      });

      api.addUtilities({
        "rounded-full": {
          "border-radius": "9999px",
        },

        ".form-select-bg": {
          "background-image":
            `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`,
          "background-position": "right 0.5rem center",
          "background-size": "1.5em 1.5em",
          "background-repeat": "no-repeat",
        },

        ".grow": {
          "flex-grow": "1",
        },
      });
    }),
  ],
} satisfies Config;
