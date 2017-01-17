const THREE = require('three');
import _ from 'lodash';
import PubSub from 'pubsub-js';

import { camera } from './camera.js';
import { targets } from './scene.js';
import { TARGET_DISTANCE, CAMERA_ORBIT_OFFSET } from './constants.js';

const mouseVector = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
export const pointerPosition = new THREE.Vector3(0, 0, TARGET_DISTANCE);
export const ray = raycaster.ray;
export const intersectableObjects = [];
const tmpPos = new THREE.Vector3();
const zeroVec = new THREE.Vector2(0, 0);


export const init = () => {
	addEventListeners();
}

const addEventListeners = () => {
	if (window.mobile) {
		window.addEventListener('deviceorientation', _.throttle(onDeviceOrientation, 33));
		window.addEventListener('touchstart', onClick);
	} else {
		window.addEventListener('mousemove', _.throttle(onMouseMove, 33));
		window.addEventListener('click', onClick);
	}
}

const onMouseMove = ({ clientX, clientY }) => {
	const x = 2 * (clientX / window.innerWidth) - 1;
	const y = 1 - 2 * (clientY / window.innerHeight);
	mouseVector.set(x, y, camera.position.z);
	raycaster.setFromCamera(mouseVector, camera);
	castFocus();
}

const onDeviceOrientation = ({ clientX, clientY }) => {
	// mouseVector.set(0, 0, camera.position.z);
	raycaster.setFromCamera(zeroVec, camera);
	castFocus();
}

const onClick = ({ clientX, clientY, touches }) => {
	let x, y;
	if (touches) {
		x = 2 * (touches[0].clientX / window.innerWidth) - 1;
		y = 1 - 2 * (touches[0].clientY / window.innerHeight);
	} else {
		x = 2 * (clientX / window.innerWidth) - 1;
		y = 1 - 2 * (clientY / window.innerHeight);
	}
	mouseVector.set(x, y, camera.position.z);
	raycaster.setFromCamera(mouseVector, camera);
	castClick();
}

const castFocus = () => {
	let found = false;
	intersectableObjects.forEach((target) => {
		const intersects = raycaster.intersectObject( target.hitArea, true );
		if (intersects.length) {
			found = true;
			target.onFocus();
			return;
		}
		target.onBlur();
	});
	if (found) return PubSub.publish('target.focus', false);
	return PubSub.publish('target.blur', false);
}

const castClick = () => {
	intersectableObjects.forEach((target) => {
		const intersects = raycaster.intersectObject( target.hitArea, false );
		if (intersects.length) return target.onClick ? target.onClick() : null;
	});
}


export const update = () => {
	if (window.mobile) {
		tmpPos.copy(camera.getWorldDirection().multiplyScalar(TARGET_DISTANCE + CAMERA_ORBIT_OFFSET));
	} else {
		tmpPos.copy(camera.position).add(raycaster.ray.direction.normalize().multiplyScalar(TARGET_DISTANCE + CAMERA_ORBIT_OFFSET));
	}
	pointerPosition.copy(tmpPos);
}
