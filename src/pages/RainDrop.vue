<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import { useAlphaThree } from '../hooks';
import { getRes, OrbitControls } from '../utils';

const { body, onUpdate, addChild, animation, size, THREE, renderer, scene } =
	useAlphaThree();

const loader = new THREE.TextureLoader();

const smoke = loader.load(getRes('/smoke.png'));
const rain = loader.load(getRes('/rain.png'));

const pointMaterial = new THREE.PointsMaterial({
	map: rain,
	transparent: true,
});

function init() {
	const { width, height } = size;

	// renderer.setClearColor(0xcce0ff);
	// scene.fog = new THREE.Fog(0xcce0ff, 2500, 10000);
	// 相机
	const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
	addChild(camera);

	camera.position.set(0, 0, 1);
	camera.lookAt(0, 0, 0);

	camera.rotation.x = 1.3;
	camera.rotation.y = -0.12;
	camera.rotation.z = 0.27;

	// 创建坐标系
	// const axes = new THREE.AxesHelper(2000);
	// addChild(axes);

	// 创建控制器
	// const controls = new OrbitControls(camera, renderer.domElement);
	// controls.enableDamping = true;

	const geometry = new THREE.PlaneGeometry(564, 300);
	const material = new THREE.MeshLambertMaterial({
		map: smoke,
		transparent: true,
	});

	const clouds: THREE.Mesh[] = [];
	for (let i = 0; i < 30; i++) {
		const cloud = new THREE.Mesh(geometry, material);
		cloud.material.opacity = 0.6;
		clouds.push(cloud);
		cloud.position.set(
			Math.random() * 1000 - 460,
			600,
			Math.random() * 500 - 400,
		);
		cloud.rotation.x = camera.rotation.x;
		cloud.rotation.y = camera.rotation.y;
		cloud.rotation.z = Math.random() * 360;
		addChild(cloud);
	}

	const positions: THREE.Vector3[] = [];

	for (let i = 0; i < 500; i++) {
		const x = Math.random() * 400 - 200;
		const y = Math.random() * 500 - 250;
		const z = Math.random() * 400 - 200;
		positions.push(new THREE.Vector3(x, y, z));
	}

	const rains = new THREE.Points(
		new THREE.BufferGeometry().setFromPoints(positions),
		pointMaterial,
	);
	addChild(rains);

	const ambientLight = new THREE.AmbientLight(0x555555);
	addChild(ambientLight);

	const directLight = new THREE.DirectionalLight(0xffeedd);
	directLight.position.set(0, 0, 1);
	addChild(directLight);

	const lightning = new THREE.PointLight(0x062d89, 20, 300, 1.7);
	addChild(lightning);

	onUpdate(t => {
		clouds.forEach(cloud => {
			cloud.rotation.z -= 0.003;
		});
		if (Math.random() > 0.93 || lightning.power > 100) {
			if (lightning.power < 100) {
				lightning.position.set(
					Math.random() * 400,
					300 + Math.random() * 200,
					100,
				);
			}
			lightning.power = 50 + Math.random() * 500;
		}
		for (let i = 0; i < positions.length; i++) {
			positions[i].y -= Math.random() * 2;
			if (positions[i].y < -height / 4) {
				positions[i].y = Math.random() * 500 - 250;
			}
			rains.geometry.attributes.position.setY(i, positions[i].y);
			rains.geometry.attributes.position.needsUpdate = true;
		}
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

<style scoped></style>
