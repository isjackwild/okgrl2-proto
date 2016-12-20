const THREE = require('three');
require('../vendor/StereoEffect.js');
import { init as initScene, scene, update as updateScene } from './scene.js';
import { init as initCamera, updatePosition as updateCameraPosition, camera } from './camera.js';
import { update as updateInputHandler } from './input-handler.js';


let canvas;
let raf, then, now, delta;
let currentCamera, currentScene;
export let renderer, stereoFx;

export const init = () => {
	canvas = document.getElementsByClassName('canvas')[0];
	setupRenderer();
	currentCamera = camera;
	currentScene = scene;
	now = new Date().getTime();
	animate();
}

export const kill = () => {
	cancelAnimationFrame(raf);
}

export const onResize = () => {
	if (renderer) renderer.setSize(window.innerWidth, window.innerHeight);
}

export const onFocus = () => {
	then = now = new Date().getTime();
}

const setupRenderer = () => {
	renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
	});

	renderer.setClearColor(0x282828);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	if (window.location.search.indexOf('vr') > -1) stereoFx = new THREE.StereoEffect(renderer);
}

const update = (delta) => {
	updateInputHandler();
	updateScene(delta);
	if (!window.mobile) updateCameraPosition(delta);
}

const render = () => {
	if (window.location.search.indexOf('vr') > -1) {
		stereoFx.render(currentScene, currentCamera);
	} else {
		renderer.render(currentScene, currentCamera);
	}
}

const animate = () => {
	then = now ? now : null;
	now = new Date().getTime();
	delta = then ? (now - then) / 16.666 : 1;
	delta = Math.max(delta, 3);

	raf = requestAnimationFrame(animate);
	
	if (window.videoShown) return;
	update(delta);
	render();
}
