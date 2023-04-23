<!--
 * @Author: wj
 * @Date: 2023-04-22 11:16:52
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-04-23 15:02:47
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
	>
		<slot name="default" />
		<el-form-item v-if="props.isSearch">
			<el-button @click="search" type="primary">查询</el-button>
			<el-button @click="reset" type="info">重置</el-button>
			<el-button @click="importData" v-if="props.isNeedExportBtn" type="success">导出</el-button>
		</el-form-item>
	</el-form>
</template>
<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import formHooks from '/@/hooks/formHooks'
import { exportDataToUrl } from '/@/utils'

const form = ref<TmFormInstanceType>(null)
const { resetFields } = formHooks(form)

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
	}
})

/**
 * @description: 导出数据
 * @author: wj_advance
 */
const importData = () => {
	exportDataToUrl(props.exportPath, { ...props.mode, ...props.extraExportParams })
}

//查询列表数据
const search = () => {
	emits('search')
}

//重置
const reset = () => {
	console.log(111)
	resetFields()
	emits('reset')
}

defineExpose({
	search
})
</script>
