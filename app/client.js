import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import MobileDetect from 'mobile-detect';

import Master from './ui/layouts/Master.js';

import { init as initLoop, onResize as onResizeRenderer, onFocus as onFocusLoop, renderer } from './3d/loop.js';
import { init as initScene } from './3d/scene.js';
import { init as initCamera, onResize as onResizeCamera, camera } from './3d/camera.js';
import { init as initInput } from './3d/input-handler.js';


const kickIt = () => {
	console.log('OKGrl!');

	const md = new MobileDetect(window.navigator.userAgent);
	window.mobile = md.mobile() ? true : false;
	if (window.mobile) document.body.classList.add('mobile');

	addEventListeners();
	
	initCamera();
	initScene();
	initLoop();
	initInput();
	initUI();
}

const initUI = () => {
	render((
		<Master/>
	), document.getElementById('react-root'));
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