<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import { useThree } from '../hooks';

const { body, onUpdate, addChild, animation, size, THREE } = useThree();

function init() {
	const { width, height } = size;
	// 相机
	const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
	addChild(camera);

	camera.position.set(0, -200, 10);
	camera.lookAt(0, 0, 0);

	const geometry = new THREE.PlaneGeometry(100, 100, 20, 20);

	const rad = 100.0 / 2.0 / Math.PI;

	const material = new THREE.ShaderMaterial({
		uniforms: {
			timestamp: {
				value: 1.0,
			},
			r: {
				value: rad,
			},
			pi: {
				value: Math.PI,
			},
		},
		vertexShader: `
            varying vec3 vColor;

			uniform float timestamp;
            uniform float r;
            uniform float pi;

            void main() {
				float angle = (uv.x - 0.5) / timestamp * pi * 2.0;
				vec3 pos = position;
				pos.x = sin(angle) * r;
				pos.z = cos(angle) * r - r;

				vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

				gl_Position = projectionMatrix * mvPosition;
				vColor = color;
            }
        `,
		fragmentShader: `
            varying vec3 vColor;

            void main() {
                gl_FragColor = vec4( vColor, 1.0 );
            }
        `,
		vertexColors: true,
	});

	material.wireframe = true;

	const plane = new THREE.Mesh(geometry, material);
	addChild(plane);

	let t = 1,
		r = rad,
		flag = true;

	onUpdate(() => {
		plane.rotation.x += 0.01;
		plane.rotation.y += 0.01;

		if (t < 1) flag = true;
		if (t > 3) flag = false;

		if (flag) {
			t += 0.01;
		} else {
			t -= 0.01;
		}

		r = rad * t;
		material.uniforms['timestamp'].value = t;
		material.uniforms['r'].value = r;
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
