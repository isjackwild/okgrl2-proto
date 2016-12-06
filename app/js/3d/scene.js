const THREE = require('three');

export let scene;
import { SKYBOX_RADIUS } from './constants.js';
import { camera, controls } from './camera.js';
import { mesh as skybox } from './skybox.js';
import { lights } from './lighting.js';
import ShopTarget from './shop-target.js'

const maxRotation = { x: 1, y: 1 };
let loops = 0;

const TWO_PI = Math.PI * 2;

export const init = () => {
	scene = new THREE.Scene();
	scene.add(camera);
	scene.add(skybox);
	
	lights.forEach((light) => {
		scene.add(light);
	});

	const x = 0.5;
	const y = 1;
	const pos = new THREE.Vector3(-SKYBOX_RADIUS, 0, 0);
	pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
	// pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), TWO_PI * y);
	// pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / -3);
	const shopTarget = new ShopTarget(pos);
	scene.add(shopTarget);
}

export const update = (delta) => {
	if (controls) controls.update(delta);
}