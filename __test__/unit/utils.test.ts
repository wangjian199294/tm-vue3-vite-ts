/// <reference lib="esnext" />
/*
 * @Author: wj
 * @Date: 2024-01-03 09:59:39
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-11 14:52:32
 * @FilePath: /tm-vue3-vite-ts/__test__/unit/utils.test.ts
 * @Description: 公共函数单元测试
 */
import { sum, dealDataToEmpty } from '../../src/utils'

describe('dealDataToEmpty', () => {
	interface IObject {
		[key: string]: any
	}
	it('应该将指定键中的0或"0"值转换为空字符串', () => {
		const data: IObject = {
			key1: 0,
			key2: '0',
			key3: 10,
			key4: '10',
		}
		const list: string[] = ['key1', 'key2']

		const result = dealDataToEmpty(data, list)

		expect(result).toEqual({
			key1: '',
			key2: '',
			key3: 10,
			key4: '10',
		})
	})

	it('对于不在列表中的键，其值不应该被修改', () => {
		const data: IObject = {
			key1: 0,
			key2: '0',
			key3: 10,
			key4: '10',
		}
		const list: string[] = ['key1', 'key2']

		const result = dealDataToEmpty(data, list)

		expect(result).not.toEqual({
			key1: 0,
			key2: '',
			key3: 10,
			key4: '10',
		})
		expect(result).not.toEqual({
			key1: '',
			key2: '0',
			key3: 10,
			key4: '10',
		})
		expect(result).toEqual({
			key1: '',
			key2: '',
			key3: 10,
			key4: '10',
		})
	})

	it('对于空的数据对象，其值不应该被修改', () => {
		const data: IObject = {}
		const list: string[] = []

		const result = dealDataToEmpty(data, list)

		expect(result).toEqual({})
	})

	it('对于空列表，其值不应该被修改', () => {
		const data: IObject = {
			key1: 0,
			key2: '0',
			key3: 10,
			key4: '10',
		}
		const list: string[] = []

		const result = dealDataToEmpty(data, list)

		expect(result).toEqual(data)
	})
})

describe('sum 函数', () => {
	// 测试针对不同情况的用例

	it('应该处理数字数组', () => {
		const result = sum([1, 2, 3])
		expect(result).toBe(6)
	})

	it('应该处理表示数字的字符串数组', () => {
		const result = sum(['1', '2', '3'])
		expect(result).toBe(6)
	})

	it('应该处理单个数字', () => {
		const result = sum(5)
		expect(result).toBe(5)
	})

	it('应该处理表示数字的字符串', () => {
		const result = sum('5')
		expect(result).toBe(5)
	})

	it('应该处理同时包含数字和字符串的数组', () => {
		const result = sum([1, '2', 3])
		expect(result).toBe(6)
	})

	it('应该处理空数组', () => {
		const result = sum([])
		expect(result).toBe(0)
	})
})
