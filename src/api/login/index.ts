/*
 * @Author: wj
 * @Date: 2023-03-19 18:41:08
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-14 14:23:41
 * @FilePath: /tm-vue3-vite-ts/src/api/login/index.ts
 * @Description:
 */
import request from '/@/utils/request'

/**
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		signIn: (params: object) => {
			return request.post('/user/signIn', params)
		},
		signOut: (params: object) => {
			return request.post('/user/signOut', params)
		},
	}
}
