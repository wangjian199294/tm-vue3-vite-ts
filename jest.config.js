/*
 * @Author: wj
 * @Date: 2024-01-03 13:03:59
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-18 11:30:34
 * @FilePath: /tm-vue3-vite-ts/jest.config.js
 * @Description:
 */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
		'^.+\\.vue$': 'vue-jest',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
	// Add any other Jest configurations as needed
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json',
			diagnostics: false, // disable ts error reporting for jest
		},
		'vue-jest': {
			experimentalCSSCompile: true,
		},
	},
	transformIgnorePatterns: [
		'/node_modules/(?!element-plus)', // allow jest to process element-plus
	],
	moduleNameMapper: {
		'^/@/(.*)$': '<rootDir>/src/$1',
	},
}
