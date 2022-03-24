<!-- @format -->

<script setup lang="ts">
	import { onMounted } from '@vue/runtime-core';
	import { useThree } from '../hooks';
	import { OrbitControls } from '../utils';

	const { body, onUpdate, addChild, animation, size, THREE, renderer } =
		useThree();

	function init() {
		const { width, height } = size;

		// 相机
		const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
		addChild(camera);

		camera.position.set(0, 0, 5);
		camera.lookAt(0, 0, 0);

		// 创建控制器
		const controls = new OrbitControls(camera, renderer.domElement);
		// controls.enableDamping = true;
		// controls.dampingFactor = 0.25;
		// controls.rotateSpeed = 0.35;

		const geometry = new THREE.SphereGeometry(1, 32, 16);

		const circleGeometry = new THREE.CircleGeometry(1, 32);
		const base = new THREE.IcosahedronGeometry(1, 1);
		console.log(base);
		const { array, count, itemSize } = base.attributes.position;
		const points: THREE.Vector3[] = [];
		for (let i = 0; i < count * itemSize; i += itemSize) {
			// const mesh = new THREE.Mesh(
			// 	circleGeometry,
			// 	new THREE.MeshBasicMaterial({
			// 		color: '#fff',
			// 		side: THREE.BackSide,
			// 	}),
			// );
			// mesh.position.copy(
			// 	new THREE.Vector3(array[i], array[i + 1], array[i + 2]),
			// );
			// mesh.scale.set(0.25, 0.25, 0.25);
			// mesh.lookAt(0, 0, 0);
			// addChild(mesh);
			points.push(new THREE.Vector3(array[i], array[i + 1], array[i + 2]));
		}

		const vertexShader = /* glsl */ `
			varying vec2 vUv;
			varying vec3 vPosition;
			void main() {
				vUv = uv;
				vPosition = position;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
		`;

		const fragmentShader = /* glsl */ `
			varying vec2 vUv;
			varying vec3 vPosition;
			uniform vec3 color;
			uniform float time;

			uniform vec3 points[POINT_COUNT];

			void main() {
				// vec2 center = vec2(0.5, 0.5);
				// vec2 pos = mod(vUv * 10.0, 1.0);
				// pos.x *= 2.0;
				// float d = distance(pos, center);
				// float mask = step(sin(time + vUv.x * 2.5) * 0.25 + 0.25, d);
				// vec3 c = mix(color, vec3(1.0), 1.0 - mask);
				float dist = 1.0;
				for (int i = 0; i < POINT_COUNT; i++) {
					vec3 p = points[i];
					float d = distance(vPosition, p);
					dist = min(dist, d);
				}

				float mask = step(0.25, dist);
				vec3 c = mix(color, vec3(1.0), 1.0 - mask);
				gl_FragColor = vec4(vec3(c), 1.0);
			}
		`;

		const material = new THREE.ShaderMaterial({
			uniforms: {
				color: {
					value: new THREE.Color('#f00'),
				},
				time: {
					value: 0,
				},
				points: {
					value: points,
				},
			},
			defines: {
				POINT_COUNT: points.length,
			},
			vertexShader,
			fragmentShader,
			vertexColors: true,
		});

		// 展示网格
		// material.wireframe = true;

		const box = new THREE.Mesh(geometry, material);
		addChild(box);

		onUpdate(t => {
			material.uniforms.time.value += 0.01;
			// plane.rotation.x += 0.01;
			// plane.rotation.y += 0.01;
			// material.uniforms['timestamp'].value = t;
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
