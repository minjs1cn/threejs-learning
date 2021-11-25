<script setup lang="ts">
import { routesWithoutHome } from '../router';
</script>

<template>
	<ul class="menu">
		<router-link
			custom
			:to="item.name"
			v-for="item in routesWithoutHome"
			:key="item.name"
			v-slot="{ navigate, isActive }"
		>
			<li :class="{ active: isActive }" @click="navigate">{{ item.name }}</li>
		</router-link>
	</ul>
</template>

<style scoped>
.menu {
	list-style: none;
	padding: 0;
	margin: 0;
}
.menu li {
	cursor: pointer;
	padding: 8px 16px;
	color: var(--text-light);
	transition: color 0.2s ease-in-out;
}
.menu li.active {
	background-color: var(--primary-light);
	color: var(--white);
}
</style>
