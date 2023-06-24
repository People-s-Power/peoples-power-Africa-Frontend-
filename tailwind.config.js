module.exports = {
	content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			display: ["group-hover"],
		},
		screens: {
			sm: { max: "700px" },
			md: "700px",
			lg: "1024px",
			xl: "1280px",
		},
	},
	plugins: [require("@tailwindcss/forms")],
}
