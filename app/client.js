import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import MobileDetect from 'mobile-detect';
import { textureLoader, colladaLoader } from './3d/loader.js';
import { SPHEREMAP_SRC, GEOM_SRC } from './3d/constants.js';

import Master from './ui/layouts/Master.js';

import { init as initLoop, onResize as onResizeRenderer, onFocus as onFocusLoop, renderer } from './3d/loop.js';
import { init as initScene } from './3d/scene.js';
import { init as initCamera, onResize as onResizeCamera, camera } from './3d/camera.js';
import { init as initInput } from './3d/input-handler.js';

let textures = [];
let geometries = [];

const kickIt = () => {
	console.log('OKGrl!');

	const md = new MobileDetect(window.navigator.userAgent);
	window.mobile = md.mobile() ? true : false;
	if (window.mobile) document.body.classList.add('mobile');

	addEventListeners();
	load();
}


const load = () => {
	textureLoader.load(SPHEREMAP_SRC, onLoadedTexture);
	colladaLoader.load(GEOM_SRC, onLoadedGeom);
}

const onLoadedTexture = (texture) => {
	textures.push(texture);

	if (geometries.length) onLoadedAll();
}

const onLoadedGeom = (object) => {
	geometries = object.scene.children;
	if (textures.length) onLoadedAll();
}

const onLoadedAll = () => {
	initScene(geometries, textures);
	initLoop();
	initInput();
	initUI();
	setTimeout(() => {
		document.getElementsByClassName('loader')[0].classList.add('loader--loaded');
	}, 555);
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