const THREE = require('three');
// require('../vendor/TrackballControls.js');
require('../vendor/OrbitControls.js');
require('../vendor/DeviceOrientationControls.js');
import { CAMERA_FOV, CAMERA_ORBIT_OFFSET } from './constants.js';

export let camera, controls;



export const init = () => {
	camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, 1, 10000);
	// camera.position.set(0, 0, CAMERA_ORBIT_OFFSET);
	// camera.lookAt(0,0,0);
	controls = new THREE.OrbitControls(camera);
	controls.target.set(
		camera.position.x,
		camera.position.y,
		camera.position.z - CAMERA_ORBIT_OFFSET,
	);
	controls.noPan = true;
	controls.noZoom = true;

	window.addEventListener('deviceorientation', setOrientationControls, true);
}

export const onResize = () => {
	if (!camera) return;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

const setOrientationControls = (e) => {
	window.removeEventListener('deviceorientation', setOrientationControls, true);
	if (!e.alpha) return;
	controls = new THREE.DeviceOrientationControls(camera, true);
	controls.connect();
	controls.update();
}