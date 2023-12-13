<!--
 * @Author: wj
 * @Date: 2023-10-11 17:51:51
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-10-12 20:07:03
 * @FilePath: /tm-lxm-system/src/components/tmTable/setting.vue
 * @Description: 配置动态列弹窗 不适用动态隐藏列及根据返回数据增加列的表格
-->
<template>
	<tm-dialog ref="dialog" @save="save" @close="close" width="800px">
		<tm-table ref="table" :column-list="columns" no-need-pagination>
			<template #hide="{ row }">
				<el-switch v-model="row.hide" :active-value="false" :inactive-value="true" />
			</template>
		</tm-table>
	</tm-dialog>
</template>
<script setup lang="ts">
import dialogHooks from '/@/hooks/dialogHooks'
import tableHooks from '/@/hooks/tableHooks'
import { deepClone, local } from '/@/utils'

const dialog = ref<TmDialogInstanceType>(null)
const table = ref<TmTableInstanceType>(null)

const { open, close } = dialogHooks(dialog)
const { setTableData } = tableHooks(table)

const emits = defineEmits<{
	(e: 'refresh'): void
}>()

const props = defineProps({
	//表格列
	columns: {
		type: Array,
		default: () => []
	},
	//table唯一标识符
	tableId: {
		type: Number,
		default: () => 0
	}
})

const list = computed(() => {
	let columns = local.get(`setting${props.tableId}`) || deepClone(props.columns)
	let arr = columns.filter((item: any) => !item.fixed)
	return arr
})

//打开
const openModel = (title: string) => {
	open(title)

	setTableData(list.value)
}

//上移
const moveUp = ({ index }: { index: number }) => {
	nextTick(() => {
		let list = table.value?.getTableData()
		list[index] = list.splice(index - 1, 1, list[index])[0]
	})
}

//下移
const moveDown = ({ index }: { index: number }) => {
	nextTick(() => {
		let list = table.value?.getTableData()
		list[index] = list.splice(index + 1, 1, list[index])[0]
	})
}

//保存
const save = () => {
	nextTick(() => {
		let list = table.value?.getTableData()
		local.set(`setting${props.tableId}`, list)
		emits('refresh')
		close()
	})
}

defineExpose({
	open: openModel
})

const columns = [
	{ label: '列名', prop: 'label' },
	{ label: '是否显示', slotName: 'hide' },
	{
		label: '操作',
		operates: [
			{ type: 'primary', name: '上移', method: moveUp, showFn: ({ index }: { index: number }) => index },
			{
				type: 'primary',
				name: '下移',
				method: moveDown,
				showFn: ({ dataLength, index }: { dataLength: number; index: number }) => dataLength - 1 > index
			}
		]
	}
]
</script>
