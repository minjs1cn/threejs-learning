import pkg from '../package.json';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export { OrbitControls };

export function getRes(str: string): string {
	return '/' + pkg.name + str;
}
