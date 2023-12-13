/*
 * @Author: wj
 * @Date: 2023-03-01 10:10:39
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-12-13 10:11:49
 * @FilePath: /tm-vue3-vite-ts/src/hooks/tableHooks.ts
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
	//设置表格数据
	const setTableData = (list: any) => {
		nextTick(() => {
			tableRef.value?.setTableData(list)
		})
	}

	//取消选中
	const clearSelection = () => {
		nextTick(() => {
			tableRef.value?.clearSelection()
		})
	}

	const doLayout = () => {
		nextTick(() => {
			tableRef.value?.doLayout()
		})
	}

	return { refresh, refreshCurrent, setTableData, clearSelection, doLayout }
}
