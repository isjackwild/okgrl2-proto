const THREE = require('three');
import TweenLite from 'gsap';
import PubSub from 'pubsub-js';
// import loader from './loader.js'
import { SKYBOX_SEGS, SKYBOX_RADIUS, SPHEREMAP_SRC, VIDEO_TRANSITION_DURATION, SKYBOX_DIM_OPACITY } from './constants.js';

// const texture = loader.load(SPHEREMAP_SRC);

export let mesh, material;

export const init = (_mesh, texture) => {
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.generateMipmaps = false;
	texture.wrapS = THREE.RepeatWrapping;
	// texture.repeat.x = -1;

	material = new THREE.MeshBasicMaterial({
		map: texture,
	});
	material.side = THREE.BackSide;

	mesh = _mesh;
	mesh.material = material;
	mesh.frustrumCulled = false;
	// mesh.rotation.y = Math.PI / -2;
	PubSub.subscribe('video.focus', dim);
	PubSub.subscribe('video.blur', brighten);
}

const dim = () => {
	material.transparent = true;
	TweenLite.to(material, VIDEO_TRANSITION_DURATION, { opacity: SKYBOX_DIM_OPACITY });
}

const brighten = () => {
	TweenLite.to(material, VIDEO_TRANSITION_DURATION, { opacity: 1, onComplete: () => { material.transparent = false } });
}