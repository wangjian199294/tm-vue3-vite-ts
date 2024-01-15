// no-inline-styles.js
module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'disallow the use of static inline styles, allow dynamic styles',
			category: 'Best Practices',
			recommended: false,
		},
		fixable: null,
		schema: [], // no options
	},
	create: function (context) {
		return {
			'VAttribute[key.name="style"][key.type="VDirectiveKey"]'(node) {
				// 忽略动态样式 (:style or v-bind:style)
				if (node.key.argument && node.key.argument.name === 'style') {
					return
				}
				context.report({
					node,
					message: 'Using static inline styles is not allowed',
				})
			},
		}
	},
}
