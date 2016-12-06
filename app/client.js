import app from './app.js';
import _ from 'lodash';

import { init as initLoop, onResize as onResizeRenderer, renderer } from './js/3d/loop.js';
import { init as initScene } from './js/3d/scene.js';
import { init as initCamera, onResize as onResizeCamera, camera } from './js/3d/camera.js';


const kickIt = () => {
	console.log('OKGrl!');
	addEventListeners();
	
	initCamera();
	initScene();
	initLoop();
}

const onResize = () => {
	onResizeCamera();
	onResizeRenderer();
}

const addEventListeners = () => {
	window.addEventListener('resize', _.throttle(onResize, 16.666));
}


document.addEventListener('DOMContentLoaded', kickIt);