/*
 * @Author: wj
 * @Date: 2023-02-23 11:07:00
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-03-01 17:18:24
 * @FilePath: /tmyd-system/src/types/dialog.d.ts
 * @Description: 弹窗类型
 */
import { TmDialog } from '/@/components'

declare global {
	type TmDialogInstanceType = InstanceType<typeof TmDialog> | null
}

export {}
