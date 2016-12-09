const THREE = require('three');
import _ from 'lodash';

import { camera } from './camera.js';
import { targets } from './scene.js';
import { SHOP_TARGET_DISTANCE, CAMERA_ORBIT_OFFSET } from './constants.js';

const mouseVector = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
export const pointerPosition = new THREE.Vector3(0, 0, SHOP_TARGET_DISTANCE);
const tmpPos = new THREE.Vector3();


export const init = () => {
	addEventListeners();
}

const addEventListeners = () => {
	if (window.mobile) {
		window.addEventListener('deviceorientation', _.throttle(onDeviceOrientation, 16.666));
	} else {
		window.addEventListener('mousemove', _.throttle(onMouseMove, 16.666));
	}
}

const onMouseMove = ({ clientX, clientY }) => {
	const x = 2 * (clientX / window.innerWidth) - 1;
	const y = 1 - 2 * (clientY / window.innerHeight);
	mouseVector.set(x, y, camera.position.z);
	raycaster.setFromCamera(mouseVector, camera);

	cast();
}

const onDeviceOrientation = ({ clientX, clientY }) => {
	// mouseVector.set(0, 0, camera.position.z);
	console.log('orientation');
	raycaster.setFromCamera(camera.position, camera);
	cast();
}

const cast = () => {
	targets.forEach((target) => {
		const intersects = raycaster.intersectObject( target, true );
		if (intersects.length) return target.onFocus();
		target.onBlur();
	});
}


export const update = () => {
	if (window.mobile) {
		tmpPos.copy(camera.getWorldDirection().multiplyScalar(SHOP_TARGET_DISTANCE + CAMERA_ORBIT_OFFSET));
	} else {
		tmpPos.copy(camera.position).add(raycaster.ray.direction.normalize().multiplyScalar(SHOP_TARGET_DISTANCE + CAMERA_ORBIT_OFFSET));
	}
	pointerPosition.copy(tmpPos);
}




// export const update = () => {
// 	if (window.mobile) {
// 		tmpPos.copy(camera.position).normalize().negate().multiplyScalar(SHOP_TARGET_DISTANCE);
// 		console.log('mobile');
// 	} else {
// 		tmpPos.copy(camera.position).add(raycaster.ray.direction.normalize().multiplyScalar(SHOP_TARGET_DISTANCE + CAMERA_ORBIT_OFFSET));
// 	}

// 	console.log(tmpPos);
	
// 	pointerPosition.copy(tmpPos);
// }