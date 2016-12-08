const THREE = require('three');

export let scene;
import { SKYBOX_RADIUS, SHOP_TARGET_DISTANCE, CAMERA_ORBIT_OFFSET } from './constants.js';
import { camera, controls } from './camera.js';
import { mesh as skybox } from './skybox.js';
import { lights } from './lighting.js';
import ShopTarget from './shop-target.js'
import { pointerPosition } from './input-handler.js';
const maxRotation = { x: 1, y: 1 };
export const shopTargets = [];

const TWO_PI = Math.PI * 2;
const FOUR_PI = Math.PI * 4;

let pointer;

const spherical = new THREE.Spherical();

export const init = () => {
	scene = new THREE.Scene();
	scene.add(camera);
	scene.add(skybox);
	
	lights.forEach((light) => {
		scene.add(light);
	});

	scene.add(new THREE.AxisHelper(10));

	// const pos = new THREE.Vector3(-SHOP_TARGET_DISTANCE, 0, 0);
	// pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
	// pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
	
	// const u = 5;
	// const v = 1;
	// const theta = TWO_PI * u;
	// const phi = Math.acos(2 * v - 1);
	// const phi = Math.PI * 1;
	// const theta = 0;
	// const x = (SHOP_TARGET_DISTANCE * Math.sin(phi) * Math.cos(theta));
	// const y = (SHOP_TARGET_DISTANCE * Math.sin(phi) * Math.sin(theta));
	// const z = SHOP_TARGET_DISTANCE * Math.cos(phi);
	
	spherical.set(SHOP_TARGET_DISTANCE, Math.PI / 1.9, Math.PI)
	const pos = new THREE.Vector3().setFromSpherical(spherical);
	const shopTarget = new ShopTarget(pos);
	shopTargets.push(shopTarget);
	scene.add(shopTarget);



	const geom = new THREE.SphereGeometry(1, 20, 20);
	const material = new THREE.MeshStandardMaterial({
		color: 0x0000ff,
		metalness: 0,
		roughness: 0,
		wireframe: true,
	});
	pointer = new THREE.Mesh(geom, material);
	scene.add(pointer);
}

export const update = (delta) => {
	// shopTargets.forEach(s => s.rotation.y += 0.01);
	if (controls) controls.update(delta);
	// pointer.position.copy(camera.get)
	pointer.position.copy(pointerPosition);
	
	// pointer.position.y += 0.01;
	// phi += 0.001;
	// theta += 0.01;
	// 
	shopTargets.forEach((target) => {
		target.update(delta);
	});
}