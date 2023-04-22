/*
 * @Author: wj
 * @Date: 2023-02-23 11:03:32
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-02-23 12:01:54
 * @FilePath: /tmyd-system/src/types/form.d.ts
 * @Description: 表单类型
 */
import { ElForm } from 'element-plus'

declare global {
	type TmFormInstanceType = InstanceType<typeof ElForm> | null
}

export {}
