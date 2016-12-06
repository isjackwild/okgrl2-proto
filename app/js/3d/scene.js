const THREE = require('three');

export let scene;
import { SKYBOX_RADIUS, SHOP_TARGET_DISTANCE } from './constants.js';
import { camera, controls } from './camera.js';
import { mesh as skybox } from './skybox.js';
import { lights } from './lighting.js';
import ShopTarget from './shop-target.js'

const maxRotation = { x: 1, y: 1 };
const shopTargets = [];

const TWO_PI = Math.PI * 2;
const FOUR_PI = Math.PI * 4;

export const init = () => {
	scene = new THREE.Scene();
	scene.add(camera);
	scene.add(skybox);
	
	lights.forEach((light) => {
		scene.add(light);
	});

	scene.add(new THREE.AxisHelper(10));

	const x = 0.5;
	const y = 1;
	const pos = new THREE.Vector3(-SHOP_TARGET_DISTANCE, 0, 0);
	// pos.applyAxisAngle(new THREE.Vector3(0.5, 1, 0).normalize(), Math.PI / 2);
	pos.applyAxisAngle(new THREE.Vector3(0, 1, 0).normalize(), TWO_PI * -0.86);
	// pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), TWO_PI * y);
	const shopTarget = new ShopTarget(pos);
	shopTargets.push(shopTarget);
	scene.add(shopTarget);
}

export const update = (delta) => {
	// shopTargets.forEach(s => s.rotation.y += 0.01);
	if (controls) controls.update(delta);
}