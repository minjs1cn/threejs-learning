<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import { useThree } from '../hooks';
import { createVideo, getRes } from '../utils';

const { body, onUpdate, addChild, animation, size, THREE } = useThree();

const video = createVideo(getRes('/sintel.mp4'));
let texture = new THREE.VideoTexture(video);

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

	camera.position.set(0, 0, 100);
	camera.lookAt(0, 0, 0);

	const geometry = new THREE.PlaneGeometry(width, height);

	const material = new THREE.MeshBasicMaterial({
		map: texture,
	});

	const plane = new THREE.Mesh(geometry, material);
	addChild(plane);

	animation();
}

onMounted(() => {
	init();
});
</script>

<template>
	<div class="scene" ref="body"></div>
</template>

<style scoped></style>
