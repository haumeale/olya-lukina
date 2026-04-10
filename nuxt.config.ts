// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
const isDev = process.env.NODE_ENV === "development";
export default defineNuxtConfig({
	ssr: true,
	devtools: { enabled: isDev },
	runtimeConfig: {
		public: {
			apiBase: "http://localhost:3001/api",
		},
	},
	app: {
		pageTransition: { name: "page", mode: "default" },
		layoutTransition: { name: "layout", mode: "default" },
	},
	css: ["./app/assets/css/tailwind.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	modules: [
		"@nuxt/eslint",
		"@nuxt/hints",
		"@nuxt/icon",
		"@dargmuesli/nuxt-cookie-control",
		"@formkit/auto-animate",
		"@nuxtjs/color-mode",
		"@nuxtjs/google-fonts",
		"@nuxtjs/i18n",
		"@nuxtjs/stylelint-module",
		"@pinia/nuxt",
		"@vueuse/nuxt",
		"dayjs-nuxt",
		"shadcn-nuxt",
	],
	shadcn: {
		/**
		 * Prefix for all the imported component.
		 * @default "Ui"
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * Will respect the Nuxt aliases.
		 * @link https://nuxt.com/docs/api/nuxt-config#alias
		 * @default "@/shared/ui"
		 */
		componentDir: "@/shared/ui",
	},

	pinia: {
		storesDirs: ["./stores/**", "./stores"],
	},
	eslint: {},
	imports: {
		autoImport: true,
		dirs: ["~/components", "~/features/**/*", "~/widgets/**/*", "~/stores/**"],
	},
	colorMode: {
		preference: "system", // default value of $colorMode.preference
		fallback: "dark", // fallback value if not system preference found
		hid: "nuxt-color-mode-script",
		globalName: "__NUXT_COLOR_MODE__",
		componentName: "ColorScheme",
		classPrefix: "",
		classSuffix: "",
		storageKey: "nuxt-color-mode",
	},
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
		{
			path: "~/features",

			pathPrefix: false,
		},
		{
			path: "~/shared",

			pathPrefix: false,
		},
		{
			path: "~/widgets",

			pathPrefix: false,
		},
	],
});
