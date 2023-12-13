/*
 * @Author: wj
 * @Date: 2023-02-21 17:27:48
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-12-13 10:12:57
 * @FilePath: /tm-vue3-vite-ts/src/hooks/formHooks.ts
 * @Description: 表单相关操作
 */

export default function (domRef: Ref<TmFormInstanceType>) {
	//清空表单验证
	const resetFields = () => {
		nextTick(() => {
			domRef.value?.resetFields()
		})
	}

	//表单校验
	const validateForm = () => {
		return new Promise((resolve) => {
			domRef.value?.validate((valid: any) => {
				if (valid) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}

	const validate = () => {
		return new Promise((resolve) => {
			nextTick(async () => {
				resolve(await domRef.value?.validate())
			})
		})
	}

	return { resetFields, validate, validateForm }
}
