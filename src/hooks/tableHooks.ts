/*
 * @Author: wj
 * @Date: 2023-03-01 10:10:39
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-03-01 19:53:37
 * @FilePath: /tmyd-system/src/hooks/tableHooks.ts
 * @Description: table相关的hooks
 */
export default function (tableRef: any) {
	//刷新
	const refresh = () => {
		nextTick(() => {
			tableRef.value?.refresh()
		})
	}
	//刷新当前页
	const refreshCurrent = () => {
		nextTick(() => {
			tableRef.value?.refreshCurrent()
		})
	}
	return { refresh, refreshCurrent }
}
