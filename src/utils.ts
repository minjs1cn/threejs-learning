import pkg from '../package.json';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

export { OrbitControls };

export function getRes(str: string): string {
	return '/' + pkg.name + str;
}

export function createVideo(
	src: string,
	loop: boolean = true,
): HTMLVideoElement {
	const video = document.createElement('video');
	video.src = src;
	video.loop = loop;
	video.muted = true;
	video.autoplay = true;
	video.play();
	return video;
}

export class CoordinateAxes extends THREE.Object3D {
	name = 'COORDINATE_AXES';
	AXIS_LENGTH = 1;
	// follows right-hand coordinate system
	AXIS_COLOR_X = 0xff0000; // red
	AXIS_COLOR_Y = 0x00ff00; // green
	AXIS_COLOR_Z = 0x0000ff; // blue

	constructor() {
		super();

		const origin = new THREE.Vector3(0, 0, 0);
		const axisX = new THREE.Vector3(1, 0, 0);
		const axisY = new THREE.Vector3(0, 1, 0);
		const axisZ = new THREE.Vector3(0, 0, 1);

		const arrowX = new THREE.ArrowHelper(
			axisX,
			origin,
			this.AXIS_LENGTH,
			this.AXIS_COLOR_X,
			this.AXIS_LENGTH / 5,
			this.AXIS_LENGTH / 10,
		);
		const arrowY = new THREE.ArrowHelper(
			axisY,
			origin,
			this.AXIS_LENGTH,
			this.AXIS_COLOR_Y,
			this.AXIS_LENGTH / 5,
			this.AXIS_LENGTH / 10,
		);
		const arrowZ = new THREE.ArrowHelper(
			axisZ,
			origin,
			this.AXIS_LENGTH,
			this.AXIS_COLOR_Z,
			this.AXIS_LENGTH / 5,
			this.AXIS_LENGTH / 10,
		);
		this.add(arrowX, arrowY, arrowZ);

		// an additional box at the origin
		const sphere = new THREE.SphereGeometry(this.AXIS_LENGTH / 20);
		const object = new THREE.Mesh(
			sphere,
			new THREE.MeshBasicMaterial({ color: 0xffff00 }),
		);
		const box = new THREE.BoxHelper(object, 0xffff00);
		this.add(box);
	}
}
