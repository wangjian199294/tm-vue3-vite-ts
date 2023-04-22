<!--
 * @Author: wj
 * @Date: 2023-02-21 10:39:37
 * @LastEditors: wj_advance
 * @LastEditTime: 2023-04-14 15:22:48
 * @FilePath: /tmyd-system/src/components/tmTable/index.vue
 * @Description: 表格组件
-->
<template>
	<div class="flex-center" v-loading="data.loading">
		<div class="flex-auto">
			<el-table
				ref="table"
				style="width: 100%"
				stripe
				border
				height="100%"
				:data="data.tableData"
				@select="select"
				@row-click="rowClick"
				@select-all="selectAll"
				@sort-change="sortChange"
				:row-key="props.rowKey"
				:current-row-key="props.currentRowKey"
				:treeChildren="props.treeChildren"
				@selection-change="selectionChange"
			>
				<template v-for="(item, index) in columnList">
					<el-table-column
						:key="index"
						:align="item.align || 'center'"
						:type="item.type"
						:prop="item.prop"
						:label="item.label"
						:width="item.width"
						:fixed="item.fixed"
						:resizable="item.prop"
						:sortable="item.sortable"
						:sort-orders="item.sortOrders"
						:reserve-selection="item.reserveSelection"
						:show-overflow-tooltip="!item.noShowOverflowTooltip"
						v-if="!item.hide"
					>
						<template #default="{ row, $index }">
							<template v-if="!item.type">
								<!-- 直接渲染html，适用于少量的，大量的不建议使用 -->
								<div v-if="item.html" v-html="item.html({ row, item })"></div>
								<!-- 按钮 -->
								<template v-else-if="item.operates && item.operates.length">
									<template v-for="(item1, index1) in item.operates">
										<el-button
											:key="index1"
											v-if="item1.showFn ? item1.showFn({ row, item, index: $index }) : true"
											:type="item1.type"
											@click.prevent="item1.method({ index: index1, row })"
											>{{ item1.name }}</el-button
										>
									</template>
								</template>
								<template v-else-if="item.slotName">
									<slot :name="item.slotName" :row="row" :index="$index"></slot>
								</template>
								<span v-else :class="item.spanClassName">{{ row[item.prop] }}</span>
							</template>
						</template>
					</el-table-column>
				</template>
			</el-table>
		</div>
		<div class="pt5" v-if="props.noNeedPagination">
			<el-pagination
				background
				small
				layout="prev,pager,next,jumper,sizes,->,total"
				:total="data.total"
				v-model:page-size="data.pageSize"
				:page-sizes="data.pageSizes"
				v-model:currentPage="data.currentPage"
				@current-change="currentChange"
				@size-change="handleSizeChange"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { TableInstance } from 'element-plus'
import Sortable from 'sortablejs'
//导出的方法，供其他页面使用
const emit = defineEmits<{
	(event: 'select', selection: Array<any>): void
	(event: 'select-all', selection: Array<any>): void
	(event: 'selection-change', selection: Array<any>): void
	(event: 'row-click', { row, column }: any): void
	(event: 'tableData', res: any): void
	(event: 'sort-change', { column, prop, order }: { column: any; prop: string; order: string | null }): void
	(event: 'drag-row', { oldRow, newRow }: { oldRow: any; newRow: any }): void
}>()

interface IProps {
	columnList: Array<any>
	queryObj?: object
	api?: Function
	noNeedPagination?: boolean
	isNowQuery?: boolean
	pageConfig?: { page: string; pageSize: string }
	currentRowKey?: string
	selectData?: Array<any>
	rowKey?: string
	treeChildren?: string
	isNeedSortTable?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
	columnList: () => [], //table列
	//查询参数
	queryObj: () => {
		return {}
	},
	//请求接口
	api: () => Function,
	//是否需要分页组件 默认需要
	noNeedPagination: () => true,
	//是否立即查询
	isNowQuery: () => true,
	//分页配置
	pageConfig: () => {
		return { page: 'page', pageSize: 'rows' }
	},
	//当前行的key
	currentRowKey: 'id',
	selectData: () => [], //选中需要回显得数据
	//row-key
	rowKey: 'id',
	//树形表格子元素的名: tree-props: { 'children' : `${treeChildren}` }
	treeChildren: () => {
		return 'children'
	},
	//是否需要拖拽表格
	isNeedSortTable: () => false
})

const table = ref<TableInstance | null>(null)

const data = reactive({
	loading: false,
	tableData: <any>[], //表格数据
	total: 0, //总数
	pageSizes: [20, 40, 60, 100, 200], //页码
	pageSize: 20, //当前每页请求数量
	currentPage: 1, //当前页码
	active: false, //是否显示筛选列弹窗
	activeRows: [],
	selectList: [] as Array<string | number>, //选中的数据
	selectionData: [] as any
})

// 将树数据转化为平铺数据
const treeToTile = (treeData: Array<any>) => {
	const arr: Array<any> = []
	const expanded = (data: any) => {
		if (data && data.length > 0) {
			data
				.filter((d: any) => d)
				.forEach((e: any) => {
					arr.push(e)
					expanded(e[props.treeChildren] || [])
				})
		}
	}
	expanded(treeData)
	return arr
}

// 将树形数据平铺为列表数据
const tileData = computed(() => {
	return treeToTile(data.tableData)
})

// 清空数据
const emptyData = () => {
	data.tableData = []
}

/**
 * @description: 初始化sortable
 * @author: zxj
 */
const initDropTable = () => {
	const el = table.value?.$el.querySelector('.el-table__body tbody')
	Sortable.create(el, {
		handle: '.el-table__row', //设置具备该类名的元素作为拖拽承载点
		onMove: function ({ dragged, related }: { dragged: any; related: any }) {
			const draggedRow = tileData.value[dragged.rowIndex]
			const relatedRow = tileData.value[related.rowIndex]
			if (draggedRow.parent_id !== relatedRow.parent_id || draggedRow.level !== relatedRow.level) {
				// 不允许跨级拖拽
				return false
			}
			return true
		},
		onEnd(evt: any) {
			const { newIndex, oldIndex } = evt
			if (newIndex === oldIndex) return // 拖拽回原位不进行下一步
			const oldRow = tileData.value[oldIndex]
			const newRow = tileData.value[newIndex]
			if (oldRow.parent_id !== newRow.parent_id || oldRow.level !== newRow.level) {
				// 不允许跨级拖拽
				return false
			}
			// data.tableData[newIndex] = oldRow
			// data.tableData[oldIndex] = newRow
			emit('drag-row', { oldRow, newRow })
		}
	})
}

/**
 * @description: 查询列表数据
 * @author: wj
 */
const getListData = async () => {
	//组织查询条件
	let selectObj = { ...props.queryObj }
	let searchData = {
		...selectObj,
		...{ [props.pageConfig.page]: data.currentPage, [props.pageConfig.pageSize]: data.pageSize }
	}
	//数组转成json,先注释
	// for (let key in searchData) {
	// 	if (Array.isArray(searchData[key])) {
	// 		searchData[key] = searchData[key].join(',')
	// 	}
	// }
	//请求数据
	data.loading = true
	let res = await props.api(searchData)
	data.loading = false
	if (res) {
		table.value?.setScrollTop(0)
		let { data: list, rows, total } = res
		let arr = list || rows
		emit('tableData', arr)
		data.tableData = arr
		data.total = total
		//设置行选中
		arr &&
			arr.forEach((item: any) => {
				props.selectData &&
					props.selectData.forEach((item1) => {
						if (item1[props.rowKey] === item[props.rowKey]) {
							nextTick(() => {
								table.value?.toggleRowSelection(item, true)
							})
						}
					})
			})
	}
}

/**
 * @description: currentPage 改变时会触发 当前页
 * @param {Number} e 当前点击的页数
 * @author: wj
 */
/** */
const currentChange = (e: number) => {
	data.currentPage = e
	getListData()
}
/**
 * @description: pageSize 改变时会触发 每页条数
 * @param {Number} e 当前点击的分页个数
 * @author: wj
 */
const handleSizeChange = (e: number) => {
	data.pageSize = e
	data.currentPage = 1
	// if (data.currentPage * e > data.total) return
	getListData()
}
/**
 * @description: 当用户手动勾选数据行的 Checkbox 时触发的事件
 * @param {Array} selection 选中的数据行
 * @author: wj
 */
const select = (selection: Array<any>, row: any) => {
	let selected: boolean | 0 = selection.length && selection.indexOf(row) !== -1
	if (selected) {
		data.selectionData.push(row)
	} else {
		let index: number = data.selectionData && data.selectionData.findIndex((item: any) => item[props.rowKey] === row[props.rowKey])
		data.selectionData.splice(index, 1)
	}
	emit('select', selection)
}
/**
 * @description: 当用户手动勾选全选 Checkbox 时触发的事件
 * @param {Array} selection 选中当前页所有的数据行
 * @author: wj
 */
const selectAll = (selection: Array<any>) => {
	if (data.tableData.length === selection.length) {
		selection.forEach((item: any) => {
			data.selectionData.push(item)
		})
	} else {
		let arr: Array<string | number> = []
		data.tableData.forEach((item: any) => {
			data.selectionData &&
				data.selectionData.forEach((item1: any) => {
					if (item[props.rowKey] === item1[props.rowKey]) {
						arr.push(item[props.rowKey])
					}
				})
		})
		data.selectionData = data.selectionData.filter((item: any) => !arr.includes(item[props.rowKey]))
	}
	emit('select-all', selection)
}
/**
 * @description: 当选择项发生变化时会触发该事件
 * @param {Array} selection 选中的行数据
 * @author: wj
 */
const selectionChange = (selection: Array<any>) => {
	emit('selection-change', selection)
}

/**
 * @description: 当某一行被点击时会触发该事件（可作为单选事件
 * @param {*} row
 * @param {*} column
 * @author: wj_advance
 */
const rowClick = (row: any, column: any) => {
	emit('row-click', { row, column })
}
/**
 * @description: 刷新表格
 * @author: wj
 */
const refresh = () => {
	data.currentPage = 1
	getListData()
}

/**
 * @description: 刷新当前页面
 * @author: wj_advance
 */
const refreshCurrent = () => {
	getListData()
}

/**
 * @description: 用于多选表格，清空用户的选择
 * @author: wj
 */
const clearSelection = () => {
	nextTick(() => {
		table.value?.clearSelection()
	})
}

const sortChange = ({ column, prop, order }: { column: any; prop: string; order: string | null }) => {
	emit('sort-change', { column, prop, order })
}

//获取选中的所有数据
const getSelectionData = () => {
	return data.selectionData
}

watch(
	() => props.selectData,
	(list) => {
		data.selectionData = list
	},
	{ deep: true }
)

onMounted(() => {
	data.selectionData = props.selectData
	if (!props.isNowQuery) return
	getListData()
	nextTick(() => {
		props.isNeedSortTable && initDropTable()
	})
})

defineExpose({
	refresh,
	clearSelection,
	refreshCurrent,
	emptyData,
	getSelectionData
})
</script>
