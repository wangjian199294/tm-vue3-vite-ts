/* eslint-disable no-undef */
const toComponentName = (name) => {
	let nameArray = name.split('/')
	return nameArray[nameArray.length - 1]
}

module.exports = function (plop) {
	plop.setGenerator('setModule', {
		description: '生成模块',
		prompts: [
			{
				type: 'input',
				name: 'path',
				message: '请输入组件路径(相对src/views/)'
			},
			{
				type: 'input',
				name: 'fields',
				message: '列表表头生成(中文,英文，逗号分隔):',
				filter: (value) => {
					const fields = value.split(',')
					const result = []
					for (let i = 0; i < fields.length; i += 2) {
						result.push({
							label: fields[i].trim(),
							prop: fields[i + 1].trim()
						})
					}
					return result
				}
			},
			{
				type: 'input',
				name: 'searchList',
				message: '查询条件生成(中文,英文,类型,逗号分隔):',
				filter: (value) => {
					const fields = value.split(',')
					const result = []
					for (let i = 0; i < fields.length; i += 3) {
						result.push({
							label: fields[i].trim(),
							prop: fields[i + 1].trim(),
							type: fields[i + 2].trim()
						})
					}
					return result
				}
			}
		],
		actions: (data) => {
			const name = toComponentName(data.path)
			const actions = [
				{
					type: 'add',
					path: 'src/views/{{path}}/index.vue',
					templateFile: 'plop-templates/module.vue.hbs',
					data: { name, path: data.path, list: data.fields }
				},
				{
					type: 'add',
					path: 'src/views/{{path}}/components/index.ts',
					templateFile: 'plop-templates/componentsImport.ts.hbs'
				},
				{
					type: 'add',
					path: 'src/views/{{path}}/components/model.vue',
					templateFile: 'plop-templates/component.vue.hbs',
					data: { name, path: data.path }
				},
				{
					type: 'add',
					path: 'src/types/{{path}}.d.ts',
					templateFile: 'plop-templates/types.d.ts.hbs',
					data: { name, list: data.searchList }
				},
				{
					type: 'add',
					path: 'src/views/{{path}}/components/search.vue',
					templateFile: 'plop-templates/search.vue.hbs',
					data: { name, list: data.searchList }
				},
				{
					type: 'add',
					path: 'src/api/{{path}}.ts',
					templateFile: 'plop-templates/api.ts.hbs',
					data: { name }
				}
			]
			return actions
		}
	})

	plop.setHelper('eq', function (v1, v2, options) {
		return v1 === v2 ? options.fn(this) : options.inverse(this)
	})
}
