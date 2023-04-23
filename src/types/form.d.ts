/*
 * @Author: wj
 * @Date: 2023-02-23 11:03:32
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-04-23 08:38:57
 * @FilePath: /tm-vue3-vite-ts/src/types/form.d.ts
 * @Description: 表单类型
 */
import { ElForm } from 'element-plus'
import TmForm from '/@/components/tmForm'

declare global {
	type TmFormInstanceType = InstanceType<typeof ElForm> | null
	type TmFormLayoutInstanceType = InstanceType<typeof TmForm> | null
}

export {}
