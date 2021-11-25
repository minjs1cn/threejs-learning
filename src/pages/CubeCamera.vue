<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import { useThree } from '../hooks';

const { body, onUpdate, addChild, animation, size, renderer, scene, THREE } =
	useThree();

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

	const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
		format: THREE.RGBFormat,
		generateMipmaps: true,
		minFilter: THREE.LinearMipmapLinearFilter,
	});

	// Create cube camera
	const cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget);
	addChild(cubeCamera);

	const chromeMaterial = new THREE.MeshLambertMaterial({
		color: 0xffffff,
		envMap: cubeRenderTarget.texture,
	});
	const planeGeometry = new THREE.PlaneGeometry(100, 100);
	const car = new THREE.Mesh(planeGeometry, chromeMaterial);
	addChild(car);

	// Update the render target cube
	car.visible = false;
	cubeCamera.position.copy(car.position);
	cubeCamera.update(renderer, scene);

	// Render the scene
	car.visible = true;

	animation();

	onUpdate(() => {});
}

onMounted(() => {
	init();
});
</script>
<template>
	<div class="scene" ref="body"></div>
</template>
