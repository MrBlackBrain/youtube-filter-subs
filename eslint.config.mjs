import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		ignores: ['dist/**/*'],
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: {
			globals: {
				...globals.browser,
				chrome: 'readonly',
			},
			ecmaVersion: 2021,
		},
	},
]);
