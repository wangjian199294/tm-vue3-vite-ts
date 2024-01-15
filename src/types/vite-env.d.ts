declare module 'vite' {
	interface ImportMetaEnv {
		readonly VITE_API_URL: string
		// 添加所有可能用到的环境变量
	}
}

declare var importMeta: ImportMeta & { env: ImportMetaEnv }
