/*
 * @Author: wj
 * @Date: 2024-01-18 11:10:57
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-21 14:27:38
 * @FilePath: /tm-vue3-vite-ts/src/__test__/unit/components/table.test.ts
 * @Description: 测试表格
 */

import { mount } from '@vue/test-utils'
import TmTable from '/@/components/tmTable/index.vue'
import Setting from '/@/components/tmTable/setting.vue'

const mockApi = jest.fn(() => Promise.resolve({ data: [{ name: '1122' }], total: 1 }))

describe('TmTable', () => {
	// 测试基本渲染和数据加载
	it('renders correctly and loads data', async () => {
		const wrapper: any = mount(TmTable, {
			props: {
				api: mockApi,
				columnList: [{ label: 'Name', prop: 'name' }],
			},
			components: {
				Setting,
			},
		})

		await wrapper.vm.$nextTick()
		await new Promise((resolve) => setTimeout(resolve, 500))
		// 断言数据是否正确加载
		expect(wrapper.vm.getTableData()).toEqual([])
		expect(wrapper.vm.$data.total).toBe(0)

		// 断言组件是否正确渲染
		expect(wrapper.html()).toMatchSnapshot()
	})
})
