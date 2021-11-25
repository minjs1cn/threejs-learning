import { ref, onMounted, onUnmounted, reactive } from '@vue/runtime-core';
import * as THREE from 'three';

export function useThree() {
	const body = ref<HTMLDivElement | null>(null);
	const size = reactive({
		width: 0,
		height: 0,
	});
	const render = ref<(t: number) => void | null>();

	let camera: THREE.Camera;
	const scene: THREE.Scene = new THREE.Scene();
	const renderer = new THREE.WebGL1Renderer();
	let timer: number;

	function init() {
		const { clientWidth = 100, clientHeight = 100 } = body.value!;
		size.width = clientWidth;
		size.height = clientHeight;

		renderer.setSize(size.width, size.height);

		// canvas
		body.value?.appendChild(renderer.domElement);
	}

	function animation(t = 0.1) {
		timer = requestAnimationFrame(animation);
		render.value && render.value(t);
		renderer.render(scene, camera);
	}

	function destroy() {
		cancelAnimationFrame(timer);
		body.value?.removeChild(renderer.domElement);
		renderer.dispose();
	}

	onMounted(() => {
		init();
	});

	onUnmounted(() => {
		destroy();
	});

	function addChild(obj: THREE.Object3D) {
		if (obj instanceof THREE.Camera) {
			setCamera(obj);
		}
		scene.add(obj);
	}

	function onUpdate(fn: (t: number) => void) {
		render.value = fn;
	}

	function setCamera(c: THREE.Camera) {
		camera = c;
	}

	return {
		body,
		size,
		animation,
		addChild,
		onUpdate,
		renderer,
		scene,
	};
}
