/*
 * @Author: wj
 * @Date: 2023-03-01 10:50:30
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-03-01 17:49:39
 * @FilePath: /tmyd-system/src/hooks/dialoghooks.ts
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
	return { open, close }
}
