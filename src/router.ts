import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const files = import.meta.globEager('/src/pages/*.vue');

export const routes: RouteRecordRaw[] = Object.keys(files).map(key => {
	const name = key.replace(/^\/src\/pages\//, '').replace(/\.vue$/, '');

	return {
		name,
		path:
			name === '404' ? '/:pathMatch(.*)*' : name === 'Home' ? '/' : '/' + name,
		component: () => import(`./pages/${name}.vue`),
		meta: {
			title: name.replace(/^\w/, c => c.toUpperCase()),
		},
	};
});

export const routesWithoutHome = [
	...routes.filter(route => route.name === 'Home'),
	...routes.filter(route => route.name !== 'Home' && route.name !== '404'),
];

export const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
