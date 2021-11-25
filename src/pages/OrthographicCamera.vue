<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import { useThree } from '../hooks';

const { body, onUpdate, addChild, animation, size, THREE } = useThree();

function init() {
	const { width, height } = size;
	// 相机
	const camera = new THREE.OrthographicCamera(
		width / -2,
		width / 2,
		height / 2,
		height / -2,
		1,
		1000,
	);
	addChild(camera);

	// 相机位置
	camera.position.set(0, 0, 200);
	// 相机朝向
	camera.lookAt(0, 0, 0);

	const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), [
		// right
		new THREE.MeshBasicMaterial({
			color: 'red',
		}),
		// left
		new THREE.MeshBasicMaterial({
			color: 'blue',
		}),
		// up
		new THREE.MeshBasicMaterial({
			color: 'green',
		}),
		// down
		new THREE.MeshBasicMaterial({
			color: 'yellow',
		}),
		// front
		new THREE.MeshBasicMaterial({
			color: 'gray',
		}),
		// back
		new THREE.MeshBasicMaterial({
			color: 'white',
		}),
	]);

	addChild(box);

	box.scale.set(50, 50, 50);

	onUpdate(() => {
		box.rotation.x += 0.01;
		box.rotation.y += 0.01;
	});

	animation();
}

onMounted(() => {
	init();
});
</script>
<template>
	<div class="scene" ref="body"></div>
</template>
