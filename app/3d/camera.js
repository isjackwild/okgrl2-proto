const THREE = require('three');
// require('../vendor/TrackballControls.js');
import PubSub from 'pubsub-js';
require('../vendor/OrbitControls.js');
require('../vendor/DeviceOrientationControls.js');
import { CAMERA_FOV, CAMERA_ORBIT_OFFSET, CAMERA_MOVE_STEP } from './constants.js';

export let camera, controls;
const axis = new THREE.Vector3(0, 1, 0);
const cameraMoveStep = {
	v: CAMERA_MOVE_STEP,
}


export const init = () => {
	camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, 0.0001, 10000);
	camera.position.set(0, 3, CAMERA_ORBIT_OFFSET);
	// camera.lookAt(0,0,0);
	controls = new THREE.OrbitControls(camera);
	controls.target.set(
		camera.position.x,
		camera.position.y,
		0,
	);

	PubSub.subscribe('target.focus', onTargetFocus);
	PubSub.subscribe('target.blur', onTargetBlur);
	// controls.noPan = true;
	// controls.noZoom = true;

	window.addEventListener('deviceorientation', setOrientationControls, true);
}

export const onResize = () => {
	if (!camera) return;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

export const updatePosition = (delta) => {
	camera.position.applyAxisAngle(axis, (cameraMoveStep.v * delta));
	camera.lookAt(controls.target);
}

const setOrientationControls = (e) => {
	window.removeEventListener('deviceorientation', setOrientationControls, true);
	if (!e.alpha) return;
	controls = new THREE.DeviceOrientationControls(camera, true);
	controls.connect();
	controls.update();
}

const onTargetFocus = () => {
	TweenLite.to(cameraMoveStep, 0.5, { v: 0 });
}

const onTargetBlur = () => {
	TweenLite.to(cameraMoveStep, 0.5, { v: CAMERA_MOVE_STEP });
}


