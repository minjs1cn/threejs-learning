import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import pkg from './package.json';

export default defineConfig({
	base: '/' + pkg.name + '/',
	plugins: [vue()],
	build: {
		rollupOptions: {
			external: ['three'],
		},
	},
});
