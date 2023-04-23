/*
 * @Author: wj
 * @Date: 2023-04-23 14:09:16
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-04-23 14:11:30
 * @FilePath: /tm-vue3-vite-ts/src/hooks/searchHooks.ts
 * @Description: 封装查询hooks
 */

export default function (searchRef: any) {
	onMounted(() => {
		nextTick(() => {
			searchRef.value?.search()
		})
	})
}
