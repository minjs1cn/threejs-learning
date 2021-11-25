<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import * as THREE from 'three';
import { useThree } from '../hooks';

const { body, onUpdate, addChild, animation, size } = useThree();

function init() {
	const { width, height } = size;
	// 相机
	const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
	addChild(camera);

	camera.position.set(0, 200, 10);
	camera.lookAt(0, 0, 0);

	const geometry = new THREE.PlaneGeometry(100, 100, 20, 20);

	const material = new THREE.ShaderMaterial({
		uniforms: {
			timestamp: {
				value: 1.0,
			},
		},
		vertexShader: `
            varying vec3 vColor;

            uniform float timestamp;

            void main() {
                vColor = color;
                vec3 pos = position;
                pos.z = 10.0 * sin(pos.x * 20.0 + timestamp * 0.005);
				vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

				gl_Position = projectionMatrix * mvPosition;
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

	// 展示网格
	material.wireframe = true;

	const plane = new THREE.Mesh(geometry, material);
	addChild(plane);

	onUpdate(t => {
		plane.rotation.x += 0.01;
		plane.rotation.y += 0.01;
		material.uniforms['timestamp'].value = t;
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
