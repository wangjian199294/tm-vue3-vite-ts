<!--
 * @Author: wj
 * @Date: 2023-02-21 17:52:52
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-04-13 18:25:01
 * @FilePath: /tmyd-system/src/components/tmDialog/index.vue
 * @Description: 弹窗组件
-->
<template>
	<el-dialog
		v-model="data.visible"
		:custom-class="props.fullscreen ? 'abow-dialog' : props.customClass || ''"
		:title="data.title || '弹窗'"
		:fullscreen="props.fullscreen"
		:width="data.width || '50%'"
		:close-on-click-modal="false"
		:destroy-on-close="!props.destryOnClose"
		:show-close="!props.loading"
		:close-on-press-escape="!props.loading"
		:append-to-body="props.appendToBody"
		@close="handleClose"
		v-if="data.visible"
		top="10vh"
	>
		<template #header v-if="props.isCustomizeHeader">
			<slot name="cust-header"></slot>
		</template>
		<slot></slot>
		<template #footer v-if="props.isNeedFootButtons">
			<el-button :disabled="props.loading" @click="close">取消</el-button>
			<el-button type="primary" :loading="props.loading" @click="save">{{ props.saveButtonTitle || '确定' }}</el-button>
			<slot name="footer-btn"></slot>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{
	(event: 'save'): void
	(event: 'close'): void
}>()

interface IProps {
	saveButtonTitle?: string
	fullscreen?: boolean
	loading?: boolean
	isNeedFootButtons?: boolean
	isCustomizeHeader?: boolean
	customClass?: string
	destryOnClose?: boolean
	appendToBody?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
	saveButtonTitle: '确定', //确定按钮title
	fullscreen: false, //是否是全屏
	loading: false, //确定按钮的loading
	isNeedFootButtons: true, //是否需要底部按钮
	isCustomizeHeader: false, //是否需要自定义头部标题部分
	customClass: '',
	destryOnClose: true, //关闭后是否销毁弹窗内的元素
	appendToBody: false //添加到body上
})

const data = reactive({
	title: '新增',
	width: '',
	visible: false
})

//打开
const open = (title: string) => {
	data.visible = true
	data.title = title
}
//保存
const save = () => {
	emit('save')
}
//关闭
const close = () => {
	data.visible = false
}

//手动关闭
const handleClose = () => {
	emit('close')
}

defineExpose({
	open,
	close
})
</script>
