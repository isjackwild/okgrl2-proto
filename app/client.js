import app from './app.js';
import _ from 'lodash';

import { init as initLoop, onResize as onResizeRenderer, onFocus as onFocusLoop, renderer } from './js/3d/loop.js';
import { init as initScene } from './js/3d/scene.js';
import { init as initCamera, onResize as onResizeCamera, camera } from './js/3d/camera.js';
import { init as initInput } from './js/3d/input-handler.js';


const kickIt = () => {
	console.log('OKGrl!');
	addEventListeners();
	
	initCamera();
	initScene();
	initLoop();
	initInput();
}

const onResize = () => {
	onResizeCamera();
	onResizeRenderer();
}

const addEventListeners = () => {
	window.addEventListener('resize', _.throttle(onResize, 16.666));
	window.addEventListener('focus', onFocusLoop);
}


document.addEventListener('DOMContentLoaded', kickIt);