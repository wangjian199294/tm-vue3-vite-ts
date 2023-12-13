/*
 * @Author: wj
 * @Date: 2023-03-01 10:50:30
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-12-13 10:12:41
 * @FilePath: /tm-vue3-vite-ts/src/hooks/dialogHooks.ts
 * @Description: 弹窗hooks
 */
export default function (dialogRef: any) {
	//打开
	const open = (title?: string) => {
		dialogRef.value?.open(title)
	}

	//关闭
	const close = () => {
		dialogRef.value?.close()
	}

	//设置数据
	const setForm = (row: any) => {
		dialogRef.value?.setForm(row)
	}

	return { open, close, setForm }
}
