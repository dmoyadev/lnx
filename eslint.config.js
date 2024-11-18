import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';

export default [
	{
		ignores: [
			'**.d.ts',
			'**/dist/**/*',
			'**/node_modules/**/*',
		],
	},

	...pluginVue.configs['flat/recommended'],
	...vueTsEslintConfig({
		extends: [
			'recommended',
			'stylistic',
		],
	}),

	{
		rules: {
			'no-console': 'off',
			'no-debugger': 'error',

			'vue/html-indent': ['warn', 'tab'],
			'vue/script-indent': ['warn', 'tab'],

			'semi': ['warn', 'always'],
			'quotes': ['warn', 'single'],
			'array-bracket-spacing': ['warn', 'never'],
			'curly': ['warn', 'multi-line'],
			'indent': ['warn', 'tab', { 'SwitchCase': 1 }],
			'comma-dangle': ['warn', 'always-multiline'],
			'arrow-spacing': 'warn',
			'object-curly-newline': [
				'warn', {
					'ObjectExpression': {
						'multiline': true,
						'minProperties': 2,
					},
				},
			],
			'object-curly-spacing': ['warn', 'always'],
			'object-property-newline': 'warn',
		},
	},
];