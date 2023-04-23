/*
 * @Author: wj
 * @Date: 2023-04-22 15:43:12
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-04-23 14:17:19
 * @FilePath: /tm-vue3-vite-ts/src/utils/index.ts
 * @Description: 公共类
 */

export const BASE_URL = import.meta.env.VITE_API_URL //url地址

/**
 * @description: 确认弹窗
 * @param {string} text 提示信息
 * @return {Promise} Promise对象
 * @author: wj_advance
 */
export const confirms: (text: string) => Promise<any> = (text = '确定执行此操作吗？') => {
	return new Promise((resolve) => {
		return ElMessageBox.confirm(text, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			center: true
		})
			.then(() => {
				resolve(true)
			})
			.catch(() => {
				resolve(false)
			})
	})
}

/**
 * @description: 弹窗提示
 * @param {string} type "success" | "warning" | "info" | "error"
 * @param {string} message 提示消息
 * @author: wj_advance
 */
export const toast = (type: 'success' | 'warning' | 'info' | 'error', message: string) => {
	ElNotification({
		title: type,
		message,
		type
	})
}

/**
 * @description: 把对象中的数组转成字符串
 * @param {IObject} params 要处理的对象数据
 * @return {object} 处理好的数据
 * @author: wj_advance
 */
export const dealArrayToString = (params: IObject): IObject => {
	let obj = { ...params }
	for (let key in obj) {
		if (Array.isArray(obj[key])) {
			obj[key] = obj[key].join(',')
		}
	}
	return obj
}

/**
 * @description: 路径拼接参数
 * @param {string} path url
 * @param {object} params 需要拼接的参数
 * @return {string} 最终拼接好的字符串
 * @author: wj_advance
 */
export const spliceParams = (path: string, params: IObject = {}): string => {
	let str = `${path}`
	let obj: IObject = {}
	//判断path上是否也携带参数
	if (path && path.includes('?')) {
		let [pathStr, paramStr] = path.split('?')
		str = pathStr
		let arr = paramStr.split('&')
		arr &&
			arr.forEach((item) => {
				let [key, value] = item.split('=')
				obj[key] = value
			})
	}
	let obj1 = dealArrayToString({ ...obj, ...params })
	if (Object.keys(obj1).length) {
		str += '?'
		for (let key in obj1) {
			str += `${key}=${obj1[key] || ''}&`
		}
		str = str.slice(0, str.length - 1)
	}
	return str
}

/**
 * @description: 导出数据
 * @param {string} url 导出url
 * @param {IObject} params 要传的参数
 * @author: wj_advance
 */
export const exportDataToUrl: (url: string, params?: IObject) => void = (url: string = '', params: IObject = {}) => {
	window.open(spliceParams(BASE_URL + url, params))
}
