const THREE = require('three');
import PubSub from 'pubsub-js';

export let scene;
import { SKYBOX_RADIUS, CAMERA_ORBIT_OFFSET, SPHEREMAP_SRC, TARGET_RADIUS, TARGET_HITAREA_RADIUS, TARGET_FOCUS_SCALE, SCALE_DAMPING, SCALE_SPRING, TARGET_MAX_WANDER } from './constants.js';
import { SHOP_DETAILS } from './SHOP_DETAILS.js';
import { init as initCamera, camera, controls } from './camera.js';
import { init as initSkybox, mesh as skybox } from './skybox.js';
import { lights } from './lighting.js';
import ShopTarget from './shop-target.js';
import VideoTarget from './video-target.js';
import VideoScreen from './video-screen.js';
import { pointerPosition, intersectableObjects } from './input-handler.js';
const maxRotation = { x: 1, y: 1 };
export const targets = [];
let videoScreen = undefined;

const TWO_PI = Math.PI * 2;
const FOUR_PI = Math.PI * 4;

let pointer;

const spherical = new THREE.Spherical();
const tmpPos = new THREE.Vector3();


export const init = (geometries, textures) => {
	const skyboxObj = geometries[0];
	const tv = geometries[1];
	const targetTv = geometries[2];
	// const targetTV = geometries[1];
	
	const targetsShop = [
		geometries[3],
		geometries[4],
		geometries[5],
		geometries[6],
		geometries[7],
		// geometries[8],
		// geometries[9],
		geometries[10]

		// geometries[4],
		// geometries[7],
	];

	// console.log(geometries);

	// SKYBOX
	initCamera();
	initSkybox(skyboxObj.children[0], textures[0]);


	// SHOP TARGETS	
	targetsShop.forEach((target, i) => {
		tmpPos.copy(target.position);
		const items = SHOP_DETAILS[i];
		const settings = {
			radius: TARGET_RADIUS,
			hitAreaRadius: TARGET_HITAREA_RADIUS,
			focusScale: TARGET_FOCUS_SCALE,
			damping: SCALE_DAMPING,
			spring: SCALE_SPRING,
			wander: TARGET_MAX_WANDER,
		}
		const shopTarget = new ShopTarget({ position: tmpPos, items, settings, i: i + 1 });
		targets.push(shopTarget);
		intersectableObjects.push(shopTarget);
	});


	// TV
	if (!window.mobile) {
		tmpPos.copy(tv.position);
		videoScreen = new VideoScreen(tv.children[0], tmpPos);
	}
	
	// TV TARGET
	tmpPos.copy(targetTv.position);
	const settings = {
		radius: TARGET_RADIUS,
		hitAreaRadius: TARGET_HITAREA_RADIUS,
		focusScale: TARGET_FOCUS_SCALE,
		damping: SCALE_DAMPING,
		spring: SCALE_SPRING,
		wander: TARGET_MAX_WANDER,
	}
	const tvTarget = new VideoTarget({ position: tmpPos, settings });
	targets.push(tvTarget);
	intersectableObjects.push(tvTarget);


	// POINTER
	const geom = new THREE.SphereGeometry(0.5, 20, 20);
	const material = new THREE.MeshStandardMaterial({
		color: 0x0000ff,
		metalness: 0,
		roughness: 0,
		wireframe: true,
	});
	pointer = new THREE.Mesh(geom, material);

	
	scene = new THREE.Scene();
	scene.add(camera);
	scene.add(skybox);
	lights.forEach((light) => {
		scene.add(light);
	});
	targets.forEach((target) => {
		scene.add(target);
	});
	if (!window.mobile) scene.add(videoScreen);
}


export const update = (delta) => {
	if (controls) controls.update(delta);
	// pointer.position.copy(pointerPosition);

	targets.forEach((target) => {
		target.update(delta);
	});
	
	if (videoScreen) videoScreen.update();
}