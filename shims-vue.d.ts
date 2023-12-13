declare module '*.vue' {
	import { App, defineComponent } from 'vue'
	const component: ReturnType<typeof defineComponent> & {
		install(app: App): void
	}
	export default component
}

declare module 'js-table2excel'
declare module 'vue-grid-layout'
declare module 'js-cookie'
