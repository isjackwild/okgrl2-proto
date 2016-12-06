const THREE = require('three');

class ShopTarget extends THREE.Object3D {
	constructor(position) {
		super();
		this.position.copy(position);
		this.setupTarget();
	}

	setupTarget() {
		const geom = new THREE.SphereGeometry(5, 20, 20);
		const material = new THREE.MeshStandardMaterial({
			color: 0xff0000,
			metalness: 0,
			roughness: 0,
		});
		const mesh = new THREE.Mesh(geom, material);
		this.add(mesh);
	}
}

export default ShopTarget;