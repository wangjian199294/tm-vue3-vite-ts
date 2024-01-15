/*
 * @Author: wj
 * @Date: 2024-01-03 13:03:59
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-11 15:01:27
 * @FilePath: /tm-vue3-vite-ts/jest.config.js
 * @Description:
 */
module.exports = {
	preset: 'ts-jest',
	moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
		'^.+\\.tsx?$': 'vite-jest',
		'^.+\\.vue$': 'vite-jest',
	},
	plugins: ['vue-jest'],
	transformIgnorePatterns: ['node_modules/(?!element-plus)/'],
	globals: {
		// 'process.env': {
		// 	VITE_API_URL: 'http://localhost:8888/', // 可以设置为测试环境的API URL
		// },
		'vite-jest': {
			tsConfig: './tsconfig.json',
		},
	},
}
