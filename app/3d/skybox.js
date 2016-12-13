const THREE = require('three');
// import loader from './loader.js'
import { SKYBOX_SEGS, SKYBOX_RADIUS, SPHEREMAP_SRC } from './constants.js';

// const texture = loader.load(SPHEREMAP_SRC);

export let mesh;

export const init = (_mesh, texture) => {
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.generateMipmaps = false;
	texture.wrapS = THREE.RepeatWrapping;
	// texture.repeat.x = -1;

	const material = new THREE.MeshBasicMaterial({
		map: texture,
	});
	material.side = THREE.BackSide;

	mesh = _mesh;
	mesh.material = material;
	mesh.frustrumCulled = false;
	// mesh.rotation.y = Math.PI / -2;
}