const THREE = require('three');

export let scene;
import { SKYBOX_RADIUS, SHOP_TARGET_DISTANCE, CAMERA_ORBIT_OFFSET, SPHEREMAP_SRC } from './constants.js';
import { init as initCamera, camera, controls } from './camera.js';
import { init as initSkybox, mesh as skybox } from './skybox.js';
import { lights } from './lighting.js';
import ShopTarget from './shop-target.js'
import VideoScreen from './video-screen.js'
import { pointerPosition } from './input-handler.js';
const maxRotation = { x: 1, y: 1 };
export const targets = [];
let videoScreen = undefined;

const TWO_PI = Math.PI * 2;
const FOUR_PI = Math.PI * 4;

let pointer;

const spherical = new THREE.Spherical();


export const init = (geometries, textures) => {
	console.log(geometries);
	const skyboxObj = geometries[0];
	const tv = geometries[3];
	// const targetTV = geometries[1];
	const targetsShop = [geometries[1], geometries[2]];


	// SKYBOX
	initSkybox(skyboxObj.children[0], textures[0]);
	


	// SHOP TARGETS	
	targetsShop.forEach((target) => {
		const pos = new THREE.Vector3().copy(target.position);
		console.log(pos, '<<<');
		const details = {
			name: 'AWESOME HANDBAG!!!!!!',
			link: 'http://www.nicopanda.com/',
		}

		const onFocus = () => {
			PubSub.publish('shop.show', details);
		}

		const onBlur = () => {
			PubSub.publish('shop.hide', false);
		}

		const shopTarget = new ShopTarget(pos, details, onFocus, onBlur);
		targets.push(shopTarget);
	});
	

	// TV
	const pos = new THREE.Vector3().copy(tv.position);
	videoScreen = new VideoScreen(tv.children[0], pos);
	
	// TV TARGET
	// ...

	// POINTER
	const geom = new THREE.SphereGeometry(0.5, 20, 20);
	const material = new THREE.MeshStandardMaterial({
		color: 0x0000ff,
		metalness: 0,
		roughness: 0,
		wireframe: true,
	});
	pointer = new THREE.Mesh(geom, material);

	initCamera();
	scene = new THREE.Scene();
	scene.add(camera);
	scene.add(skybox);
	lights.forEach((light) => {
		scene.add(light);
	});
	targets.forEach((target) => {
		scene.add(target);
	});
	scene.add(videoScreen);
	scene.add(pointer);

	// geometries.forEach((geo) => {
	// 	scene.add(geo);
	// });

	// scene.add(tv);
}


export const update = (delta) => {
	if (controls) controls.update(delta);
	pointer.position.copy(pointerPosition);

	targets.forEach((target) => {
		target.update(delta);
	});
	videoScreen.update();
}