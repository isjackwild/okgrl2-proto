const THREE = require('three');
import { SHOP_TARGET_RADIUS } from './constants.js';

class ShopTarget extends THREE.Object3D {
	constructor(position) {
		super();
		this.position.copy(position);
		this.setupTarget();

		this.add(new THREE.AxisHelper(5));
		this.lookAt(new THREE.Vector3(0, 0, 0));
	}

	setupTarget() {
		const geom = new THREE.SphereGeometry(SHOP_TARGET_RADIUS, 20, 20);
		const material = new THREE.MeshStandardMaterial({
			color: 0xff0000,
			metalness: 0,
			roughness: 0,
			wireframe: true,
		});
		const mesh = new THREE.Mesh(geom, material);
		this.add(mesh);
	}
}

export default ShopTarget;