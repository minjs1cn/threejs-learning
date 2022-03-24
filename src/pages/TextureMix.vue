<!-- @format -->

<script setup lang="ts">
	import { onMounted } from '@vue/runtime-core';
	import { useThree } from '../hooks';
	import { getRes } from '../utils';

	const { body, onUpdate, addChild, animation, size, THREE } = useThree();

	const loader = new THREE.TextureLoader();

	let texture = loader.load(getRes('/touxiang.png'));

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

		const geometry = new THREE.PlaneGeometry(500, 500, 20, 20);

		const basic = THREE.ShaderLib.basic;

		const material = new THREE.ShaderMaterial({
			uniforms: {
				...basic.uniforms,
				timestamp: {
					value: 1.0,
				},
				u_texture1: {
					value: loader.load(getRes('/guoqi.png')),
				},
				u_texture2: {
					value: texture,
				},
			},
			vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
			fragmentShader: `
            varying vec2 vUv;

            uniform sampler2D u_texture1;
            uniform sampler2D u_texture2;

            void main() {
                vec4 headImg = texture2D(u_texture2, vUv);
                vec4 other = texture2D(u_texture1, vUv);
								float mask = vUv.x * vUv.y < 0.5 ? 1.0 - vUv.x * vUv.y * 2.0 : 0.0;
                gl_FragColor = mix(headImg, other , mask * 0.8);
            }
        `,
			vertexColors: true,
		});

		const plane = new THREE.Mesh(geometry, material);
		addChild(plane);

		onUpdate(t => {
			material.uniforms.u_texture2.value = texture;
		});

		animation();
	}

	onMounted(() => {
		init();
	});

	const onChange = (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		const reader = new FileReader();
		reader.readAsDataURL(file!);
		reader.onload = function () {
			texture = loader.load(reader.result as string);
		};
	};
</script>

<template>
	<div class="scene">
		<div class="canvas" ref="body"></div>
		<div class="buttons">
			<input
				class="upload"
				type="file"
				name="file"
				id="file"
				accept="image/*"
				@change="onChange"
			/>
		</div>
	</div>
</template>

<style scoped>
	.canvas {
		width: 500px;
		height: 500px;
		margin: 0 auto;
	}

	.buttons {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 30px 0;
	}
</style>
