import * as THREE from 'three';
import * as d3 from 'd3-geo';
import data from './china.json';

export enum EColors {
	COLOR1 = '#02A1E2',
	COLOR2 = '#3480C4',
	COLOR3 = 0xff0000,
	WHITE = 'white',
}

export function importMapObject3D(): Promise<THREE.Object3D> {
	return new Promise(resolve => {
		// TODO 墨卡托投影转换 https://zhuanlan.zhihu.com/p/326955505
		const projection = d3
			.geoMercator()
			.center([104.0, 37.5])
			.scale(80)
			.translate([0, 0]);
		const mapObject3D = new THREE.Object3D();

		data.features.forEach(item => {
			// 创建一个省份3D对象
			const province = new THREE.Object3D();
			// 坐标数组
			const coordinates = item.geometry.coordinates;

			coordinates.forEach(multiPolygon => {
				multiPolygon.forEach(polygon => {
					const shape = new THREE.Shape();
					// 所有内置的 Geometry 最终都会被转为 BufferGeometry
					const bufferGeometry = new THREE.BufferGeometry();

					const vertices = [];

					for (let i = 0; i < polygon.length; i++) {
						const polygonProjection = projection(
							polygon[i] as [number, number],
						);
						if (polygonProjection) {
							const [x, y] = polygonProjection;
							if (i === 0) {
								shape.moveTo(x, -y);
							}
							shape.lineTo(x, -y);

							vertices.push(x);
							vertices.push(-y);
							vertices.push(4);
						}
					}
					// 设置它的顶点信息
					bufferGeometry.setAttribute(
						'position',
						new THREE.BufferAttribute(new Float32Array(vertices), 3),
					);

					// 利用连续的闭合线段构建一个几何体
					const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
						depth: 4, // 可以理解为几何体的厚度/深度
						bevelEnabled: false, // 几何体侧面形状的倒角，false代表圆滑
					});

					const mesh = new THREE.Mesh(extrudeGeometry, [
						new THREE.MeshBasicMaterial({
							color: EColors.COLOR1,
							transparent: true,
							opacity: 0.6,
						}),
						new THREE.MeshBasicMaterial({
							color: EColors.COLOR2,
							transparent: true,
							opacity: 0.5,
						}),
					]);

					const line = new THREE.Line(
						bufferGeometry,
						new THREE.LineBasicMaterial({
							color: EColors.WHITE,
						}),
					);

					mesh.name = item.properties.name;
					// 一个省份对象是由两部分构成
					province.add(mesh);
					province.add(line);
				});
			});

			mapObject3D.add(province);
		});

		resolve(mapObject3D);
	});
}
