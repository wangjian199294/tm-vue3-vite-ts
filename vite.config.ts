/*
 * @Author: wj
 * @Date: 2022-12-08 09:11:32
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-12-13 11:05:24
 * @FilePath: /tm-vue3-vite-ts/vite.config.ts
 * @Description:
 */
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import viteCompression from 'vite-plugin-compression'

const pathResolve = (dir: string): any => {
	return resolve(__dirname, '.', dir)
}

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
}

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd())
	return {
		plugins: [
			vue(),
			vueSetupExtend(),
			AutoImport({
				// 目标文件
				include: [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.vue$/,
					/\.vue\?vue/, // .vue
					/\.md$/ // .md
				],
				// 全局引入插件
				imports: [
					// presets
					'vue',
					'vue-router',
					'pinia',
					// custom
					{
						'@vueuse/core': [
							// named imports
							'useMouse', // import { useMouse } from '@vueuse/core',
							// alias
							['useFetch', 'useMyFetch'] // import { useFetch as useMyFetch } from '@vueuse/core',
						],
						axios: [
							// default imports
							['default', 'axios'] // import { default as axios } from 'axios',
						],
						'[package-name]': [
							'[import-names]',
							// alias
							['[from]', '[alias]']
						]
					}
				],
				dts: true,
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				resolvers: [ElementPlusResolver()]
			}),
			//按需自动导入样式文件
			createStyleImportPlugin({
				resolves: [ElementPlusResolve()]
			}),
			//压缩文件
			viteCompression({
				verbose: true,
				disable: false,
				// filter:()=>{}, // 那些资源不压缩
				threshold: 1024 * 50, // 体积大于 threshold 才会被压缩,单位 b
				deleteOriginFile: false, // 压缩后是否删除源文件
				algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
				ext: '.gz' // 生成的压缩包后缀
			})
		],
		root: process.cwd(),
		resolve: { alias },
		base: './',
		hmr: true,
		optimizeDeps: {
			include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en', 'element-plus/lib/locale/lang/zh-tw']
		},
		server: {
			open: true,
			port: 8080,
			host: '0.0.0.0',
			proxy: {
				'/*': {
					target: env.VITE_API_URL,
					ws: true,
					changeOrigin: true
				}
			}
		},
		build: {
			outDir: 'dist',
			sourcemap: false,
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					entryFileNames: `js/[name].[hash].js`,
					// chunkFileNames: `js/[name].[hash].js`,
					assetFileNames: `[ext]/[name].[hash].[ext]`,
					compact: true,
					manualChunks: {
						vue: ['vue'],
						'vue-router': ['vue-router'],
						pinia: ['pinia'],
						echarts: ['echarts']
					},
					chunkFileNames: (chunkInfo) => {
						const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : []
						const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]'
						return `js/${fileName}/[name].[hash].js`
					}
				},
				parallel: true // 启用并行构建
			},
			minify: 'terser',
			terserOptions: {
				compress: {
					keep_infinity: true,
					drop_console: false,
					drop_debugger: true
				},
				output: {
					// 去掉注释内容
					comments: true
				}
			},
			cssCodeSplit: true
		},
		css: {
			preprocessorOptions: { css: { charset: false } }
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version)
		}
	}
})

export default viteConfig
