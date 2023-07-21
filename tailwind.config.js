/** @type {import('tailwindcss').Config} */

const isWidgetOnly = process.env.MODE === "widget";

module.exports = {
  important: isWidgetOnly ? "#twamm-terminal" : false,
  corePlugins: {
    preflight: isWidgetOnly ? false : true,
  },
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "twamm-input-light": "#EBEFF1",
        "twamm-bg": "#fff",
        "twamm-dark-bg": "#292A33",
        "twamm-jungle-green": "#24AE8F",
        "twamm-primary": "#FBA43A",
      },
      fontSize: {
        xxs: ["0.625rem", "1rem"],
      },
      backgroundImage: {
        "twamm-gradient":
          "linear-gradient(104.11deg, #3A3B43 2.09%, #3A3B43 24.01%, rgba(58, 59, 67, 0.56) 119%)",
        "twamm-swap-gradient":
          "linear-gradient(96.8deg, rgba(250, 164, 58, 1) 4.71%, rgba(113, 229, 237, 1) 87.84%)",
        "v2-gradient":
          "linear-gradient(104.11deg, #3A3B43 2.09%, #3A3B43 24.01%, rgba(58, 59, 67, 0.56) 119%)",
      },
    },
  },
  plugins: [],
};
