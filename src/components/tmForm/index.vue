<!--
 * @Author: wj
 * @Date: 2023-04-22 11:16:52
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-21 14:37:49
 * @FilePath: /tm-vue3-vite-ts/src/components/tmForm/index.vue
 * @Description: 表单组件外层form封装
-->
<template>
	<el-form
		ref="form"
		:inline="props.inline"
		:model="props.mode"
		:label-width="props.labelWidth + 'px'"
		:rules="props.rules"
		:status-icon="props.statusIcon"
		scroll-to-error
		v-bind="$attrs"
		@keyup.enter.native="query"
	>
		<slot name="default" />
		<el-form-item v-if="props.isSearch">
			<el-button @click="search" type="primary">查询</el-button>
			<el-button @click="reset" type="info" v-if="!props.noReset">重置</el-button>
			<el-button @click="importData" v-if="props.isNeedExportBtn" type="success">导出</el-button>
			<slot name="footer" />
		</el-form-item>
	</el-form>
</template>
<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import formHooks from '/@/hooks/formHooks'
import { exportDataToUrl } from '/@/utils'

const form = ref<TmFormInstanceType>(null)
const { resetFields, validateForm } = formHooks(form)

const emits = defineEmits<{
	(event: 'search'): void
	(event: 'reset'): void
}>()

interface IProps {
	mode: IObject
	labelWidth?: number
	rules?: FormRules
	inline?: boolean
	statusIcon?: boolean
	isSearch?: boolean
	isNeedExportBtn?: boolean
	exportPath?: string
	extraExportParams?: IObject
	noReset?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
	//form表单
	mode: () => {
		return {}
	},
	//标签宽度
	labelWidth: () => 80,
	//校验规则
	rules: () => {
		return {}
	},
	//是否是行内表单模式
	inline: () => false,
	//是否在输入框中显示校验结果反馈图标
	statusIcon: () => true,
	//是否是查询功能
	isSearch: () => false,
	//是否需要导出按钮
	isNeedExportBtn: () => false,
	//导出路径,
	exportPath: () => '',
	//额外的导出参数
	extraExportParams: () => {
		return {}
	},
	//是否显示重置按钮
	noReset: () => false,
})

/**
 * @description: 导出数据
 * @author: wj_advance
 */
const importData = () => {
	console.log({ ...props.mode, ...props.extraExportParams })
	exportDataToUrl(props.exportPath, { ...props.mode, ...props.extraExportParams })
}

//查询列表数据
const search = () => {
	emits('search')
}

//重置
const reset = () => {
	resetFields()
	emits('reset')
	//目的: 自定义表单组件清空表单
	inject('reset')
}

//回车查询
const query = () => {
	if (!props.inline) return
	search()
}

//校验规则
const validate = async () => {
	let flag = await validateForm()
	return new Promise((resolve) => {
		resolve(flag)
	})
}

defineExpose({
	search,
	validate,
})
</script>
