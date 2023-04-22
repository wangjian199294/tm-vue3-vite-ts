/*
 * @Author: wj
 * @Date: 2023-02-21 17:27:48
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-03-21 11:58:17
 * @FilePath: /tmyd-system/src/hooks/formHooks.ts
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
	const validate = () => {
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

	return { resetFields, validate }
}