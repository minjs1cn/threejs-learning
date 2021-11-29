<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-core';
import { useThree } from '../../hooks';
import { OrbitControls } from '../../utils';
import { EColors, importMapObject3D } from './object3D';

const { body, onUpdate, addChild, animation, size, THREE, renderer, scene } =
	useThree();

let camera: THREE.PerspectiveCamera;

async function init() {
	const { width, height } = size;
	// 相机
	camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
	addChild(camera);

	camera.position.set(45, 45, 150);
	camera.lookAt(0, 0, 0);

	// 创建坐标系
	const axes = new THREE.AxesHelper(2000);
	addChild(axes);

	// 创建地面辅助
	const grid = new THREE.GridHelper(500, 50);
	addChild(grid);

	// 创建控制器
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.rotateSpeed = 0.35;

	const mapObject3D = await importMapObject3D();
	addChild(mapObject3D);

	animation();
}

// 创建射线
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0);

function onMouseMove(event: MouseEvent) {
	const { offsetX, offsetY } = event;

	// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
	updateMouse({
		x: (offsetX / size.width) * 2 - 1,
		y: -(offsetY / size.height) * 2 + 1,
	});
}

function onTouchEnd(event: TouchEvent) {
	const { clientX, clientY } = event.touches[0];

	updateMouse({
		x: (clientX / size.width) * 2 - 1,
		y: -(clientY / size.height) * 2 + 1,
	});
}

const info = ref<HTMLDivElement>();

function updateMouse(evt: THREE.Vec2) {
	mouse.x = evt.x;
	mouse.y = evt.y;
	info.value!.style.left = ((mouse.x + 1) / 2) * size.width + 5 + 'px';
	info.value!.style.top = ((mouse.y - 1) / -2) * size.height + 5 + 'px';
}

type TMesh = THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshBasicMaterial[]>;
// 上次选中的区域
let lastPick: TMesh;

// 渲染
function render() {
	if (mouse.x !== 0) {
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(scene.children, true);
		const find = intersects.find(
			item =>
				(item.object as TMesh).material &&
				(item.object as TMesh).material.length === 2,
		);

		if (lastPick) {
			let [m1, m2] = lastPick.material;
			m1.color.set(EColors.COLOR1);
			m2.color.set(EColors.COLOR2);
			// 改变材质之后，必须将刷新标识位挂起
			m1.needsUpdate = true;
			m2.needsUpdate = true;
		}

		if (find) {
			lastPick = find.object as TMesh;
			let [m1, m2] = lastPick.material;
			m1.color.set(EColors.COLOR3);
			m2.color.set(EColors.COLOR3);
			m1.needsUpdate = true;
			m2.needsUpdate = true;

			if (lastPick.name) {
				info.value!.textContent = lastPick.name;
				info.value!.style.display = 'block';
			} else {
				info.value!.style.display = 'none';
			}
		} else {
			info.value!.style.display = 'none';
		}
	}
}

onMounted(() => {
	init();
	onUpdate(() => {
		render();
	});
});
</script>

<template>
	<div class="scene">
		<div
			class="canvas"
			ref="body"
			@touchend="onTouchEnd"
			@mousemove="onMouseMove"
		></div>
		<div class="info" ref="info">china</div>
	</div>
</template>

<style scoped>
.canvas {
	width: 100%;
	height: 100%;
}
.info {
	position: absolute;
	background-color: #fff;
	border-radius: 4px;
	color: #000;
	display: none;
	padding: 4px 6px;
}
</style>
