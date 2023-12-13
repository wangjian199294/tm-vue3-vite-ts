<!--
 * @Author: wj
 * @Date: 2023-02-21 17:52:52
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-12-13 10:15:28
 * @FilePath: /tm-vue3-vite-ts/src/components/tmDialog/index.vue
 * @Description: 弹窗组件
-->
<template>
	<Teleport to="body">
		<el-dialog
			v-model="data.visible"
			:title="data.title || '弹窗'"
			:fullscreen="props.fullscreen"
			:width="props.width || '50%'"
			:close-on-click-modal="false"
			:destroy-on-close="!props.destryOnClose"
			:show-close="!props.loading"
			:close-on-press-escape="!props.loading"
			:append-to-body="props.appendToBody"
			@close="handleClose"
			v-if="data.visible"
			top="10vh"
			:class="{
				'dialog-height': !props.fullscreen,
				'abow-dialog': props.fullscreen,
				'abow-dialog-no-footer': props.fullscreen && !props.isNeedFootButtons
			}"
			v-bind="$attrs"
		>
			<template #header v-if="props.isCustomizeHeader">
				<slot name="cust-header"></slot>
			</template>
			<slot></slot>
			<template #footer v-if="props.isNeedFootButtons">
				<el-button :disabled="props.loading" @click="handleClose" size="default">取 消</el-button>
				<el-button type="primary" :loading="props.loading" @click="save" size="default">{{ props.saveButtonTitle || '确 定' }}</el-button>
				<slot name="footer-btn"></slot>
			</template>
		</el-dialog>
	</Teleport>
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
	destryOnClose?: boolean
	appendToBody?: boolean
	width: string
}

const props = withDefaults(defineProps<IProps>(), {
	saveButtonTitle: '确 定', //确定按钮title
	fullscreen: false, //是否是全屏
	loading: false, //确定按钮的loading
	isNeedFootButtons: true, //是否需要底部按钮
	isCustomizeHeader: false, //是否需要自定义头部标题部分
	destryOnClose: true, //关闭后是否销毁弹窗内的元素
	appendToBody: false, //添加到body上
	width: '50%' //弹窗的宽度
})

const data = reactive({
	title: '新增',
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
<style lang="scss" scoped>
.dialog_custom_border {
	border-top: 1px solid #ebeef5;
}
</style>
