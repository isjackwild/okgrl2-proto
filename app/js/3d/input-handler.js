const THREE = require('three');
import _ from 'lodash';

import { camera } from './camera.js';
import { shopTargets } from './scene.js';
import { SHOP_TARGET_DISTANCE, CAMERA_ORBIT_OFFSET } from './constants.js';

const mouseVector = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
export const pointerPosition = new THREE.Vector3(0, 0, SHOP_TARGET_DISTANCE);

export const init = () => {
	addEventListeners();
}

const addEventListeners = () => {
	window.addEventListener('mousemove', _.throttle(onMouseMove, 16.666));
}

const onMouseMove = ({ clientX, clientY }) => {
	const x = 2 * (clientX / window.innerWidth) - 1;
	const y = 1 - 2 * (clientY / window.innerHeight);
	mouseVector.set(x, y, camera.position.z);

	raycaster.setFromCamera(mouseVector.clone(), camera);
	shopTargets.forEach((target) => {
		const intersects = raycaster.intersectObject( target, true );
		if (intersects.length) return target.onFocus();
		target.onBlur();
	});
}


export const update = () => {
	// DESKTOP
	const pos = new THREE.Vector3().copy(camera.position).add(raycaster.ray.direction.normalize().multiplyScalar(SHOP_TARGET_DISTANCE + CAMERA_ORBIT_OFFSET));
	pointerPosition.copy(pos);
	console.log(raycaster.ray.direction.normalize());

	// MOBILE
	// pointerPosition.copy(new THREE.Vector3().copy(camera.position).normalize().negate().multiplyScalar(SHOP_TARGET_DISTANCE));
}