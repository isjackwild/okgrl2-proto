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
let mouseIsDown = false;


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

	PubSub.subscribe('target.focus', easeOutAutoMove);
	PubSub.subscribe('target.blur', easeInAutoMove);
	window.addEventListener('mousedown', e => mouseIsDown = true);
	window.addEventListener('mouseup', e => mouseIsDown = false);
	controls.noPan = true;
	controls.noZoom = true;

	window.addEventListener('deviceorientation', setOrientationControls, true);
}

export const onResize = () => {
	if (!camera) return;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

export const updatePosition = (delta) => {
	if (mouseIsDown || window.videoShown) return;
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

const easeOutAutoMove = () => {
	TweenLite.to(cameraMoveStep, 0.8, { v: 0, ease: Sine.easeInOut });
}

const easeInAutoMove = () => {
	TweenLite.to(cameraMoveStep, 0.8, { v: CAMERA_MOVE_STEP, ease: Sine.easeInOut });
}


