/*
 * @Author: wj
 * @Date: 2023-04-22 15:43:12
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-21 15:50:49
 * @FilePath: /tm-vue3-vite-ts/src/utils/index.ts
 * @Description: 公共类
 */
import useClipboard from 'vue-clipboard3'
import { Local } from './storage'
interface IObject {
	[key: string]: any
}

/**
 * @description: 弹窗提示
 * @param {string} type "success" | "warning" | "info" | "error"
 * @param {string} message 提示消息
 * @author: wj_advance
 */
export const toast = (type: 'success' | 'warning' | 'info' | 'error', message: string) => {
	let title = {
		success: '成功',
		warning: '警告',
		info: '提示',
		error: '错误',
	}
	ElNotification({
		title: title[type],
		message,
		type,
	})
}

//storage数据处理
export const local = Local

//点击下载文件
export const downloadImg = (imgSrc: string) => {
	let image = new Image()
	// 解决跨域 Canvas 污染问题
	image.setAttribute('crossOrigin', 'anonymous')
	image.onload = function () {
		let canvas = document.createElement('canvas')
		canvas.width = image.width
		canvas.height = image.height
		let context = canvas.getContext('2d')
		context?.drawImage(image, 0, 0, image.width, image.height)
		let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
		let a = document.createElement('a') // 生成一个a元素
		let event = new MouseEvent('click') // 创建一个单击事件
		a.download = new Date().getTime().toString() // 设置图片名称
		a.href = url // 将生成的URL设置为a.href属性
		a.dispatchEvent(event) // 触发a的单击事件
	}
	image.src = imgSrc
}

// 点击复制文本
export const copyText = (text: string) => {
	const { toClipboard } = useClipboard()
	return new Promise((resolve, reject) => {
		try {
			//复制
			toClipboard(text)
			//下面可以设置复制成功的提示框等操作
			toast('success', '复制成功')
			resolve(text)
		} catch (e) {
			//复制失败
			toast('error', '复制失败')
			reject(e)
		}
	})
}

/**
 * @description: 把对象中值为0的转为空字符串,只转换list中字段
 * @param {IObject} data 要转换的数据
 * @param {string} list 字段集合
 * @return {IObject} 转换后的数据
 * @author: wj_advance
 */
export const dealDataToEmpty = (data: IObject, list: string[]): any => {
	for (let key in data) {
		if (list.includes(key)) {
			if (data[key] === 0 || data[key] === '0') {
				data[key] = ''
			}
		}
	}
	return data
}

//url地址
// export const BASE_URL: string = import.meta.env.VITE_API_URL !== '/' ? import.meta.env.VITE_API_URL : location.origin
export const BASE_URL: string = ''

/**
 * @description: 确认弹窗
 * @param {string} text 提示信息
 * @return {Promise} Promise对象
 * @author: wj_advance
 */
export const confirms: (text: string) => Promise<any> = (text: string = '确定执行此操作吗？'): Promise<any> => {
	return new Promise((resolve) => {
		return ElMessageBox.confirm(text, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			center: true,
		})
			.then(() => {
				resolve(true)
			})
			.catch(() => {
				resolve(false)
			})
	})
}

//消息提示
export const message = (type: 'success' | 'warning' | 'info' | 'error', message: string) => {
	ElMessage({
		message,
		type,
		grouping: true,
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
export const exportDataToUrl = (url: string = '', params: IObject = {}) => {
	window.open(spliceParams(BASE_URL + url, params), '_blank')
}

/**
 * @description: 深度克隆
 * @param {any} target 要克隆的数据
 * @param {string[]} list 要转换的字段集合
 * @return {any}
 * @author: wj_advance
 */
export const deepClone = (target: any, list?: string[]): any => {
	// 定义一个变量
	let result
	// 如果当前需要深拷贝的是一个对象的话
	if (typeof target === 'object') {
		// 如果是一个数组的话
		if (Array.isArray(target)) {
			result = [] // 将result赋值为一个数组，并且执行遍历
			for (let i in target) {
				// 递归克隆数组中的每一项
				result.push(deepClone(target[i]))
			}
			// 判断如果当前的值是null的话；直接赋值为null
		} else if (target === null) {
			result = null
			// 判断如果当前的值是一个RegExp对象的话，直接赋值
		} else if (target.constructor === RegExp) {
			result = target
		} else {
			// 否则是普通对象，直接for in循环，递归赋值对象的所有值
			result = {}
			for (let i in target) {
				result[i] = deepClone(target[i])
			}
		}
		// 如果不是对象的话，就是基本数据类型，那么直接赋值
	} else {
		result = target
	}
	// 返回最终结果
	list && list.length && (result = dealDataToEmpty(result, list))
	return result
}

/**
 * @description: 将textarea输入的内容转为逗号拼接
 * @param {string} val
 * @author: tianchenxi
 */
export const toComma = (val?: string): string => {
	if (typeof val !== 'string' || !val) return ''
	let ids = ''
	let newArr = val.replace(/\n/g, ',').replace(/，/g, ',')
	let result = newArr.split(',')
	// 去重
	result = [...new Set(result)]
	// 去空
	result = result.filter((s: string) => {
		return s && s.trim()
	})
	result = result.map((i: string) => {
		return i && i.trim()
	})
	ids = result.toString()
	return ids
}

/**
 * @description: 判断对象数组中是否有为空的键值
 * @param {any} arr
 * @author: tianchenxi
 */
export const hasEmptyKeysInArray = (arr?: any[]): boolean => {
	if (!(arr instanceof Array)) return false
	for (let i = 0; i < arr.length; i++) {
		const obj = arr[i]

		// eslint-disable-next-line no-use-before-define
		if (hasEmptyKeysInObject(obj)) {
			return true
		}
	}

	return false
}

/**
 * @description: 判断对象中是否有为空的键值，并且包含其children
 * @param {object} obj
 * @param {string} children
 * @author: tianchenxi
 */
export const hasEmptyKeysInObject = (obj: object, children?: string): boolean => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key]

			// 如果属性的值为 undefined、null 或空字符串，返回 true
			if (value !== 0 && !value) {
				return true
			}

			// 如果属性的值是一个对象，并且该对象具有子对象 "children"，则递归检查子对象
			if (typeof value === 'object' && value.hasOwnProperty(children)) {
				if (hasEmptyKeysInArray(value.children)) {
					return true
				}
			}
		}
	}

	return false
}

/**
 * @description: 数字求和或者数字字符串转换
 * @param {string|array} 求和的数据或数字转换
 * @return: {number} 返回结果
 * @author: wj_advance
 */
export const sum = (params: (number | `${number}`)[] | number | `${number}`) => {
	let data = 0
	if (typeof params === 'string' || typeof params === 'number') {
		data = Math.round(Number(params) * 1000)
	} else if (Array.isArray(params)) {
		const filteredParams = params.filter((item: any) => item !== null && item !== undefined)
		filteredParams &&
			filteredParams.forEach((item) => {
				data += Math.round(Number(item) * 1000)
			})
	}
	return data / 1000
}

/**
 * @description: 校验手机号
 * @param {string} phoneNumber
 * @return {boolean} 返回结果
 * @author: tianchenxi
 */
export const isValidPhoneNumber = (phoneNumber: string) => {
	let phoneRegExp = /^1[3456789]\d{9}$/
	return phoneRegExp.test(phoneNumber)
}
