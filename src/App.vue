<script setup lang="ts">
import Layout from './components/Layout.vue';
import AsideMenu from './components/AsideMenu.vue';
</script>

<template>
	<Layout>
		<template v-slot:aside>
			<AsideMenu />
		</template>
		<router-view />
	</Layout>
</template>

<style>
:root {
	--primary: rgb(24, 40, 68);
	--primary-light: rgb(76, 125, 209);

	--text: rgb(18, 18, 18);
	--text-light: rgb(150, 150, 150);

	--white: #fff;
}
html,
body {
	height: 100%;
}
body {
	margin: 0;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	height: 100%;
}
.scene {
	position: relative;
	height: 100%;
	width: 100%;
}
</style>
