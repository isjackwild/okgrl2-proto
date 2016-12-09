const THREE = require('three');
import PubSub from 'pubsub-js';

import { VIDEO_SRC_SD } from './constants.js';

class VideoScreen extends THREE.Object3D {
	constructor(w, h, pos) {
		super();

		this.position.copy(pos);
		this.w = w;
		this.h = h;

		this.isFocused = false;
		this.video = undefined;
		this.map = undefined;

		this.setup();
	}

	setup() {
		this.video = document.createElement('video');
		this.video.autoplay = true;
		this.video.mute = true;
		this.video.src = VIDEO_SRC_SD;

		this.map = new THREE.Texture(this.video);
		const geom = new THREE.PlaneGeometry(this.w, this.h, 1);
		const material = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			metalness: 0,
			roughness: 0,
			map: this.map,
		});
		const mesh = new THREE.Mesh(geom, material);
		this.add(mesh);
	}

	update() {
		if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) this.map.needsUpdate = true;
	}
}

export default VideoScreen;
