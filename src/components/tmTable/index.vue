<!--
 * @Author: wj
 * @Date: 2023-02-21 10:39:37
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-21 15:51:28
 * @FilePath: /tm-vue3-vite-ts/src/components/tmTable/index.vue
 * @Description: 表格组件
-->
<template>
	<div class="flex-center">
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
				v-bind="$attrs"
			>
				<template v-for="(item, index) in cols">
					<el-table-column
						:key="index"
						:align="item.align || 'center'"
						:header-align="item.headerAlign || 'center'"
						:type="item.type"
						:prop="item.prop"
						:label="item.label"
						:width="item.width"
						:fixed="item.fixed"
						:sortable="item.sortable"
						:sort-orders="item.sortOrders"
						:reserve-selection="item.reserveSelection"
						:show-overflow-tooltip="!item.noShowOverflowTooltip"
						:min-width="item.minWidth"
						v-if="!item.hide"
					>
						<template #default="{ row, $index, column }">
							<template v-if="!item.type">
								<!-- 直接渲染html，适用于少量的，大量的不建议使用 -->
								<div v-if="item.html" v-html="item.html({ row, item })"></div>
								<!-- 按钮 -->
								<template v-else-if="item.operates && item.operates.length">
									<template v-for="(item1, index1) in item.operates as any[]">
										<el-button
											:key="index1"
											v-if="item1.showFn ? item1.showFn({ row, item, index: $index, dataLength: data.tableData.length }) : true"
											:type="item1.type"
											link
											@click.prevent="item1.method({ index: $index, row })"
											>{{ item1.name }}</el-button
										>
									</template>
								</template>
								<div v-else-if="item.slotName" class="tm-white-space tm-overflow-hidden">
									<slot :name="item.slotName" :row="row" :index="$index" :column="column"></slot>
								</div>
								<span v-else :class="item.spanClassName">{{ formatProp(row, item.prop) }}</span>
							</template>

							<!-- 展开行具名插槽 -->
							<template v-if="item.type === 'expand'">
								<slot name="expand" :row="row"></slot>
							</template>
						</template>

						<template #header="{ column, $index, row }">
							<!-- 自定义表头 -->
							<template v-if="item.customHead">
								<slot :item="item" :name="`${item.prop}_head`" :column="column" :index="$index" :row="row" />
							</template>
							<template v-else>
								{{ item.label }}
								<el-tooltip class="box-item" raw-content effect="dark" :content="item.tips" placement="top">
									<el-icon v-if="item.tips" size="12" color="var(--el-color-info)"><ele-InfoFilled /></el-icon>
								</el-tooltip>
							</template>
						</template>
					</el-table-column>
				</template>
			</el-table>
		</div>
		<div class="pt5" v-if="!props.noNeedPagination">
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
		<template v-if="props.tableId && flag">
			<teleport :to="`#setting${props.tableId}`">
				<el-icon v-if="props.tableId" :size="22" class="ml10 tm-cursor-pointer" color="#999" @click="openSetting"><ele-Menu /></el-icon>
			</teleport>
			<Setting ref="settingRef" v-if="flag && props.tableId" :columns="props.columnList" :table-id="props.tableId" @refresh="refreshSetting" />
		</template>
	</div>
</template>
<script setup lang="ts">
import type { TableInstance } from 'element-plus'
import Sortable from 'sortablejs'
import { deepClone, local } from '/@/utils'
import Setting from './setting.vue'
import dialogHooks from '/@/hooks/dialogHooks'

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

const settingRef = ref<InstanceType<typeof Setting> | null>(null)

const { open } = dialogHooks(settingRef)

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
	tableId?: number
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
	noNeedPagination: () => false,
	//是否立即查询
	isNowQuery: () => true,
	//分页配置
	pageConfig: () => {
		return { page: 'page', pageSize: 'per_page' }
	},
	//当前行的key
	currentRowKey: 'id',
	//选中需要回显得数据
	selectData: () => [],
	//row-key
	rowKey: 'id',
	//树形表格子元素的名: tree-props: { 'children' : `${treeChildren}` }
	treeChildren: () => {
		return 'children'
	},
	//是否需要拖拽表格
	isNeedSortTable: () => false,
	//表格id,做表格排序配置使用,如果要做表格列顺序、显隐操作必传且全系统唯一
	tableId: () => 0,
})

const table = ref<TableInstance | null>(null)

const data = reactive({
	loading: false,
	tableData: [] as Array<{ [key: string | number]: any }>, //表格数据
	total: 0, //总数
	pageSizes: [20, 40, 60, 100, 200], //页码
	pageSize: 20, //当前每页请求数量
	currentPage: 1, //当前页码
	active: false, //是否显示筛选列弹窗
	activeRows: [],
	selectList: [] as Array<string | number>, //选中的数据
	selectionData: [] as any,
})

const flag = ref(false) //传送门展示变量
const columnsList = ref([]) //中转表格列变量

// 将树数据转化为平铺数据
const treeToTile = (treeData: Array<any>) => {
	const arr: Array<any> = []
	const expanded = (list: any) => {
		if (list && list.length > 0) {
			list
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

const formatProp = (row: any, prop: string) => {
	let str = ''
	if (prop) {
		if (prop.includes('.')) {
			let [str1, str2] = prop.split('.')
			str = row[str1] && row[str1][str2]
		} else {
			str = row[prop]
		}
	}
	return str
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
			emit('drag-row', { oldRow, newRow })
		},
	})
}

//设置选中
const setSelectData = (list: any[]) => {
	data.tableData &&
		data.tableData.forEach((item: any) => {
			list &&
				list.forEach((item1: any) => {
					if (item1[props.rowKey] === item[props.rowKey]) {
						nextTick(() => {
							table.value?.toggleRowSelection(item, true)
						})
					}
				})
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
		...{ [props.pageConfig.page]: data.currentPage, [props.pageConfig.pageSize]: data.pageSize },
	}
	//数组转成json
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
		// table.value?.setScrollTop(0)
		let { data: list, total } = res
		emit('tableData', res)
		data.tableData = list
		data.total = total
		setSelectData(props.selectData)
	}
}

watch(
	() => props.selectData,
	(list: any) => {
		//设置行选中
		setSelectData(list)
	},
	{ deep: true },
)

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
 * @description: 用于多选表格，清空用户的选择
 * @author: wj
 */
const clearSelection = () => {
	nextTick(() => {
		table.value?.clearSelection()
	})
}

/**
 * @description: 刷新表格
 * @author: wj
 */
const refresh = () => {
	data.currentPage = 1
	clearSelection()
	getListData()
}

/**
 * @description: 刷新当前页面
 * @author: wj_advance
 */
const refreshCurrent = () => {
	clearSelection()
	getListData()
}

const sortChange = ({ column, prop, order }: { column: any; prop: string; order: string | null }) => {
	emit('sort-change', { column, prop, order })
}

//获取选中的所有数据
const getSelectionData = () => {
	return data.selectionData
}

//设置表格数据
const setTableData = (list: any) => {
	data.tableData = list
	table.value?.doLayout()
}

//展开表格
const setTableExpend = (row: any, expanded: any) => {
	nextTick(() => {
		table.value?.toggleRowExpansion(row, expanded)
	})
}

watch(
	() => props.selectData,
	(list) => {
		data.selectionData = list
	},
	{ deep: true },
)

//获取表格数据
const getTableData = () => {
	return data.tableData
}

//打开配置弹窗
const openSetting = () => {
	open('配置')
}

//刷新表格列
const refreshSetting = () => {
	let columns = local.get(`setting${props.tableId}`) || deepClone(props.columnList)
	let list = columns.filter((item: any) => !item.fixed)
	columnsList.value = list
}

const cols: any = computed(() => {
	let columns = local.get(`setting${props.tableId}`)
	let list = columnsList.value.length ? columnsList.value : columns
	//过滤掉中间的数据, 保留两边的数据
	let arr = props.columnList.filter((item) => item.fixed)
	//把数据插到中间
	if (list) {
		if (arr.at(-1)?.operates) {
			//如果有操作列
			arr.splice(-1, 0, ...list)
		} else if (!arr.at(-1)?.fixed) {
			//如果最后一个没有固定列
			arr.splice(0, 0, ...list)
		}
	}
	return list && list.length ? arr : props.columnList
})

onMounted(() => {
	nextTick(() => {
		props.isNeedSortTable && initDropTable()
		setTimeout(() => {
			props.tableId && (flag.value = true)
		}, 200)
		data.selectionData = deepClone(props.selectData)
		if (props.isNowQuery) return
		if (!props.api) return
		getListData()
	})
})

defineExpose({
	refresh,
	clearSelection,
	refreshCurrent,
	emptyData,
	getSelectionData,
	setTableData,
	getTableData,
	setTableExpend,
	table,
})
</script>
