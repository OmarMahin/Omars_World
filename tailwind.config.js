/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                backgroundColor: "#EDE8E8",
                secondaryBackgroundColor: "#D1CDCD",
                fontColor: "#1E1E1E",
                secondaryColor: "#1B1B1B",
                lightFontColor: "#3C3C3C",
            },
            fontFamily: {
                mainHeading: ["Josefin Sans"],
                subHeading: ["Langar"],
                mainFont: ["Istok Web"],
            },
            maxWidth: {
                conatiner: "1024px",
                "480B": "480px",
            },

            screens: {
                "480B": "480px",
            },

            keyframes: {
                growLeft: {
                    "0%, 100%": {  left: "50%", borderRadius: "0" },
                    "40%, 60%": {


                        borderRadius: "50%",
                    },
                    "50%": {
                        left: "0%",
                    },
                },
                growRight: {
                    "0%, 100%": {  left: "50%", borderRadius: "0" },
                    "40%, 60%": {


                        borderRadius: "50%",
                    },
                    "50%": {
                        left: "100%",
                    },
                },

                fade: {
                    "0%": { top: "0" },
                    "100%": { top: "-100%" },
                },
            },
        },
    },
    plugins: [
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    "animate-delay": (value) => ({
                        animationDelay: value,
                    }),
                },
                { values: theme("transitionDelay") }
            );
        }),
    ],
};
