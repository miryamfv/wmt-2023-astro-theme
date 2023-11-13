/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				body: "rgb(var(--color-bg))",
				"box-bg": "rgb(var(--color-box))",
				"box-shadow": "rgb(var(--box-sd))",
				"box-border": "rgb(var(--box-border))",
				primary: "#B6EC44",
				"heading-1": "rgb(var(--heading-1))",
				"heading-2": "rgb(var(--heading-2))",
				"heading-3": "rgb(var(--heading-3))",
				"hotpink": "#ea58f9",
				"aqua": "#5ad1d2",
			},
			screens:{
				midmd:"880px"
			},
			fontSize: {
				sm: '1.5rem',
				base: '2rem',
				xl: '2.25rem',
				'2xl': '2.75rem',
				'3xl': '3.25rem',
				'4xl': '3.75rem',
				'5xl': '4.25rem',
			  }
		},
	},
	plugins: [],
}
