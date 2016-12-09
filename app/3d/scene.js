const THREE = require('three');

export let scene;
import { SKYBOX_RADIUS, SHOP_TARGET_DISTANCE, CAMERA_ORBIT_OFFSET } from './constants.js';
import { camera, controls } from './camera.js';
import { mesh as skybox } from './skybox.js';
import { lights } from './lighting.js';
import ShopTarget from './shop-target.js'
import VideoScreen from './video-screen.js'
import { pointerPosition } from './input-handler.js';
const maxRotation = { x: 1, y: 1 };
export const shopTargets = [];
let videoScreen = undefined;

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
	
	spherical.set(SHOP_TARGET_DISTANCE, Math.PI / 1.9, Math.PI)
	const pos = new THREE.Vector3().setFromSpherical(spherical);
	const details = {
		name: 'AWESOME HANDBAG!!!!!!',
		link: 'http://www.nicopanda.com/',
	}
	const shopTarget = new ShopTarget(pos, details);
	shopTargets.push(shopTarget);
	scene.add(shopTarget);

	videoScreen = new VideoScreen(16, 9, new THREE.Vector3(0, 0, -20));
	scene.add(videoScreen);


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
	if (controls) controls.update(delta);
	pointer.position.copy(pointerPosition);

	shopTargets.forEach((target) => {
		target.update(delta);
	});
	videoScreen.update();
}