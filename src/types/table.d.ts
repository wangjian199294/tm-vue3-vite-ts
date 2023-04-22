/*
 * @Author: wj
 * @Date: 2023-02-23 11:46:29
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-02-23 12:01:20
 * @FilePath: /tmyd-system/src/types/table.d.ts
 * @Description: 表格类型
 */
import { TmTable } from '../components'

declare global {
	type TmTableInstanceType = InstanceType<typeof TmTable> | null
}

export {}
