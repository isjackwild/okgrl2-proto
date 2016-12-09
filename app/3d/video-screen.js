const THREE = require('three');
import PubSub from 'pubsub-js';

import { VIDEO_SRC_SD } from './constants.js';

class VideoScreen extends THREE.Object3D {
	constructor(mesh, pos) {
		super();

		this.position.copy(pos);
		this.mesh = mesh;

		this.isFocused = false;
		this.video = undefined;
		this.map = undefined;
		
		this.setup();
	}

	setup() {
		this.video = document.createElement('video');
		this.video.autoplay = true;
		this.video.muted = true;
		this.video.src = VIDEO_SRC_SD;

		this.map = new THREE.Texture(this.video);
		// this.map.minFilter = THREE.NearestFilter;
		// const geom = new THREE.PlaneGeometry(16, 9, 1);

		const material = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			metalness: 0,
			roughness: 0,
			map: this.map,
		});
		// const mesh = new THREE.Mesh(this.geom, material);
		material.side = THREE.DoubleSide;
		this.mesh.material = material;

		// console.log(this.geom, geom);
		this.add(this.mesh);
	}

	update() {
		if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) this.map.needsUpdate = true;
	}
}

export default VideoScreen;
