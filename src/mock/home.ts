/*
 * @Author: wj
 * @Date: 2024-01-14 14:15:49
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-15 14:41:28
 * @FilePath: /tm-vue3-vite-ts/src/mock/home.ts
 * @Description: 模拟接口请求
 */
import { MockMethod } from 'vite-plugin-mock'

export default [
	{
		url: `/b2c-gateway/base/shop/list1`, // 注意，这里只能是string格式
		method: 'post',
		response: () => {
			return {
				code: 0,
				msg: 'mock成功',
				data: {
					menusList: [
						{
							id: '1',
							title: '南辰',
							subMenuList: [
								{
									id: '11',
									title: '南',
									path: '/user/nan',
								},
								{
									id: '12',
									title: '小',
									path: '/user',
								},
								{
									id: '13',
									title: '辰',
									path: '/user/chen',
								},
							],
						},
						{
							id: '2',
							title: '希',
							subMenuList: [
								{
									id: '21',
									title: '玩游戏',
									path: '/user/play',
								},
							],
						},
					],
				},
			}
		},
	},
] as MockMethod[]
