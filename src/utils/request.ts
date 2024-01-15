/*
 * @Author: wj
 * @Date: 2022-12-08 09:11:32
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-15 14:40:53
 * @FilePath: /tm-vue3-vite-ts/src/utils/request.ts
 * @Description: 请求
 */
import axios, { AxiosInstance } from 'axios'
import { Session } from '/@/utils/storage'
import { toast } from '/@/utils'
import { ElLoading } from 'element-plus'
import Cookies from 'js-cookie'

const getCookie = () => {
	return Cookies.get('PHPSESSID')
}

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
})

// 添加请求拦截器
service.interceptors.request.use(
	(config: any) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			config.headers!['access-token'] = 123456
		}
		return config
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error)
	},
)

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data
		if (res.code && res.code !== 0) {
			// `token` 过期或者账号已在别处登录
			if (res.code === 3 || res.code === 500) {
				// Session.clear() // 清除浏览器全部临时缓存
				// window.location.href = '/' // 去登录页
				// ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
				// 	.then(() => { })
				// 	.catch(() => { })
			}
			toast('error', res.msg)
			// return Promise.reject(service.interceptors.response)
			return Promise.reject(false)
		} else {
			return response.data
		}
	},
	(error) => {
		console.log(error)

		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时')
		} else if (error.message == 'Network Error') {
			ElMessage({
				type: 'error',
				message: '网络连接错误',
				grouping: true,
			})
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText)
			else ElMessage.error('接口路径找不到')
		}
		return Promise.reject(error)
	},
)

//参数类型
interface IParams {
	config: {
		//请求地址
		url: string
		//请求参数
		params: any
		//是否展示提示
		showToast?: boolean
		//是否展示全局loading
		showLoading?: boolean
	}
}

const http = {
	get: <T extends IParams>(obj: T['config']) => {
		let loading: any = ''
		let { url, params, showToast = false, showLoading = true } = obj

		loading =
			showLoading &&
			ElLoading.service({
				target: '#app',
				text: '努力加载中...',
			})
		return new Promise((resolve) => {
			service
				.get(url, { params: { ...params, stoken: getCookie() } })
				.then((response) => {
					loading && loading.close()
					let res: any = response
					if (res.code === 0) {
						showToast && toast('success', res.msg)
						resolve(res.data)
					} else {
						toast('error', res.msg)
						resolve(false)
					}
				})
				.catch((error) => {
					loading && loading.close()
					resolve(error)
				})
		})
	},
	post: <T extends IParams>(obj: T['config']) => {
		let loading: any = ''
		let { url, params, showToast = true, showLoading = true } = obj

		loading =
			showLoading &&
			ElLoading.service({
				target: '#app',
				text: '努力加载中...',
			})
		return new Promise((resolve, reject) => {
			service
				.post(`${url}?stoken=${getCookie()}`, { ...params, stoken: getCookie() })
				.then((response) => {
					loading && loading.close()
					let res: any = response
					if (res.code === 0) {
						showToast && toast('success', res.msg)
						resolve(res.data)
					} else {
						resolve(false)
						toast('error', res.msg)
					}
				})
				.catch((error) => {
					loading && loading.close()
					reject(error)
				})
		})
	},
	put: <T extends IParams>(obj: T['config']) => {
		let loading: any = ''
		let { url, params, showToast = false, showLoading = true } = obj
		loading =
			showLoading &&
			ElLoading.service({
				target: '#app',
				text: '努力加载中...',
			})
		return new Promise((resolve, reject) => {
			service
				.put(`${url}?stoken=${getCookie()}`, { ...params, stoken: getCookie() })
				.then((response) => {
					loading && loading.close()
					let res: any = response
					if (res.code === 0) {
						showToast && toast('success', res.msg)
						resolve(res.data)
					} else {
						resolve(false)
						toast('error', res.msg)
					}
				})
				.catch((error) => {
					loading && loading.close()
					reject(error)
				})
		})
	},
	delete: <T extends IParams>(obj: T['config']) => {
		let loading: any = ''
		let { url, params, showToast = true, showLoading = true } = obj
		loading =
			showLoading &&
			ElLoading.service({
				target: '#app',
				text: '努力加载中...',
			})
		return new Promise((resolve, reject) => {
			service
				.delete(url, { data: { ...params, stoken: getCookie() } })
				.then((response) => {
					loading && loading.close()
					let res: any = response
					if (res.code === 0) {
						showToast && toast('success', res.msg)
						resolve(res.data)
					} else {
						resolve(false)
						toast('error', res.msg)
					}
				})
				.catch((error) => {
					loading && loading.close()
					reject(error)
				})
		})
	},
	patch: <T extends IParams>(obj: T['config']) => {
		let loading: any = ''
		let { url, params, showToast = false, showLoading = true } = obj
		loading =
			showLoading &&
			ElLoading.service({
				target: '#app',
				text: '努力加载中...',
			})
		return new Promise((resolve, reject) => {
			service
				.patch(url, { ...params, stoken: getCookie() })
				.then((response) => {
					loading && loading.close()
					let res: any = response
					if (res.code === 0) {
						showToast && toast('success', res.msg)
						resolve(res.data)
					} else {
						resolve(false)
						toast('error', res.msg)
					}
				})
				.catch((error) => {
					loading && loading.close()
					reject(error)
				})
		})
	},
}

// 导出
export default http
