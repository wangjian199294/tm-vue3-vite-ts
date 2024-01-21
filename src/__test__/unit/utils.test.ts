/// <reference lib="esnext" />
/*
 * @Author: wj
 * @Date: 2024-01-03 09:59:39
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-18 11:14:55
 * @FilePath: /tm-vue3-vite-ts/src/__test__/unit/utils.test.ts
 * @Description: 公共函数单元测试
 */
import { sum, dealDataToEmpty, confirms } from '/@/utils'

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

describe('confirms function', () => {
	it('调用confirm时解析为true', async () => {
		// 创建一个 mock 函数来模拟 ElMessageBox.confirm
		const confirmMock = jest.fn().mockResolvedValueOnce(() => Promise.resolve({}))

		// 在全局对象中设置 ElMessageBox 属性
		;(global as any).ElMessageBox = {
			confirm: confirmMock,
		}
		// 调用确认函数
		const result = await confirms('确定执行此操作吗？')

		// 验证结果为 true
		expect(result).toBe(true)
		// 验证 mock 函数被调用了一次
		expect(confirmMock).toHaveBeenCalledWith('确定执行此操作吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			center: true,
		})

		// 删除设置的全局属性，以避免影响其他测试
		delete (global as any).ElMessageBox
	})
})
