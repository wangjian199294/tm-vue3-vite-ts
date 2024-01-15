/*
 * @Author: wj
 * @Date: 2024-01-14 14:22:03
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-15 18:16:19
 * @FilePath: /tm-vue3-vite-ts/src/api/home/index.ts
 * @Description:
 */
import http from '/@/utils/request'

export const getList = () => http.post({ url: '/base/shop/list', params: { page: 1, page_size: 10 } })
