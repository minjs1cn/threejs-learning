import pkg from '../package.json';

export function getRes(str: string): string {
	return '/' + pkg.name + str;
}
