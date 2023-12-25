const fs = require('fs')
const path = require('path')

/* eslint-disable no-undef */
const toComponentName = (name) => {
	let nameArray = name.split('/')
	return nameArray[nameArray.length - 1]
}

//验证文件夹是否存在
const verifyFileExist = (dirName, dirPath, tail = '') => {
	const directories = fs.readdirSync(dirPath)
	return directories.includes(dirName + tail)
}

module.exports = function (plop) {
	plop.setGenerator('setModule', {
		description: '生成模块',
		prompts: [
			{
				type: 'input',
				name: 'path',
				message: '请输入组件路径(相对src/views/)',
				validate: (dirName) => {
					if (!dirName || dirName.trim() === '') {
						// 验证用户是否输入
						// 返回字符串报错
						return '文件夹路径名称不能为空'
					} else if (verifyFileExist(dirName.trim(), path.join(__dirname, '/src/views'))) {
						// 验证文件是否存在
						// 返回字符串报错r
						return '文件夹已经存在'
					} else {
						// 则继续执行 action
						return true
					}
				}
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
					console.log('\n' + fields)
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
					console.log('\n' + fields)
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
