<script setup lang="ts">
const list = [
	{
		title: '官方中文文档',
		url: 'https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene',
	},
	{
		title: 'three.js 笔记',
		url: 'https://juejin.cn/column/6997334020249878565',
	},
	{
		title: 'WebGL 理论基础',
		url: 'https://webglfundamentals.org/webgl/lessons/zh_cn/',
	},
	{
		title: 'three.js 教程',
		url: 'http://www.yanhuangxueyuan.com/Three.js_course/first.html',
	},
	{
		title: '图解 WebGL&Three.js 工作原理',
		url: 'https://www.cnblogs.com/wanbo/p/6754066.html',
	},
	{
		title: 'OpenStreetMap',
		url: 'https://www.openstreetmap.org/relation/270056',
	},
];
</script>
<template>
	<div class="scene home">
		<h1>three.js learning</h1>
		<ul>
			<li v-for="(item, index) in list" :key="index">
				<a :href="item.url" target="blank">{{ item.title }}</a>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.home {
	padding: 30px;
}
h1 {
	margin-top: 0;
}
</style>
