const THREE = require('three');
import PubSub from 'pubsub-js';

export let scene;
import { SKYBOX_RADIUS, CAMERA_ORBIT_OFFSET, SPHEREMAP_SRC } from './constants.js';
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
		geometries[8],
		geometries[9],
		geometries[10],
		geometries[11],
		geometries[12]
	];

	// SKYBOX
	initCamera();
	initSkybox(skyboxObj.children[0], textures[0]);


	// SHOP TARGETS	
	targetsShop.forEach((target) => {
		tmpPos.copy(target.position);
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

		const shopTarget = new ShopTarget({ position: tmpPos, details, onFocus, onBlur });
		targets.push(shopTarget);
	});


	// TV
	if (!window.mobile) {
		tmpPos.copy(tv.position);
		videoScreen = new VideoScreen(tv.children[0], tmpPos);
	}
	
	// TV TARGET
	tmpPos.copy(targetTv.position);
	const onClick = () => {
		console.log('click tv');
		PubSub.publish('video.show', true);
	}
	const onFocus = () => {
		if (window.mobile) return;
		PubSub.publish('video.focus', true);
	}
	const onBlur = () => {
		if (window.mobile) return;
		PubSub.publish('video.blur', true);
	}
	const tvTarget = new ShopTarget({ position: tmpPos, onFocus, onBlur, onClick });
	targets.push(tvTarget);


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
	// scene.add(pointer);

	// geometries.forEach((geo) => {
	// 	scene.add(geo);
	// });

	// scene.add(tv);
}


export const update = (delta) => {
	if (controls) controls.update(delta);
	// pointer.position.copy(pointerPosition);

	targets.forEach((target) => {
		target.update(delta);
	});
	
	if (videoScreen) videoScreen.update();
}