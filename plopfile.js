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
			}
		],
		actions: (data) => {
			const name = toComponentName(data.path)
			const actions = [
				{
					type: 'add',
					path: 'src/views/{{path}}/index.vue',
					templateFile: 'plop-templates/module.vue.hbs',
					data: { name }
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
					data: { name }
				},
				{
					type: 'add',
					path: 'src/types/{{path}}.d.ts',
					templateFile: 'plop-templates/types.d.ts.hbs',
					data: { name }
				},
				{
					type: 'add',
					path: 'src/views/{{path}}/components/search.vue',
					templateFile: 'plop-templates/search.vue.hbs',
					data: { name }
				}
			]
			return actions
		}
	})
}
