const THREE = require('three');
import { SHOP_TARGET_RADIUS, SHOP_HITAREA_RADIUS, SHOP_TARGET_FOCUS_SCALE, SCALE_SPRING, SCALE_DAMPING } from './constants.js';
import { pointerPosition } from './input-handler.js';

class ShopTarget extends THREE.Object3D {
	constructor(position) {
		super();
		this.target = undefined;
		this.hitArea = undefined;

		this.isFocused = false;

		this.currentScale = 1;
		this.targetScale = 1;
		this.scaleVelocity = 0;

		console.log(position.x);
		this.position.copy(position);
		console.log(this.position.x);
		this.targetPosition = new THREE.Vector3().copy(position);
		this.restPosition = new THREE.Vector3().copy(position);
		this.positionVelocity = new THREE.Vector3(0, 0, 0);

		this.setupTarget();
		this.setupHitArea();

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
		this.target = new THREE.Mesh(geom, material);
		this.add(this.target);
		this.scale.set(this.currentScale, this.currentScale, this.currentScale);
	}

	setupHitArea() {
		const geom = new THREE.SphereGeometry(SHOP_HITAREA_RADIUS, 20, 20);
		const material = new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			metalness: 0,
			roughness: 0,
			transparent: true,
			opacity: 0.2,
		});
		material.visible = false;
		this.hitArea = new THREE.Mesh(geom, material);
		this.add(this.hitArea);
	}

	onFocus() {
		if (this.isFocused) return;
		this.isFocused = true;
		this.targetScale = SHOP_TARGET_FOCUS_SCALE;
		this.targetPosition.copy(pointerPosition);
		console.log(new THREE.Vector3().copy(this.targetPosition).sub(this.position).multiplyScalar(SCALE_SPRING));
	}

	onBlur() {
		if (!this.isFocused) return;
		this.isFocused = false;
		this.targetScale = 1;
		this.targetPosition.copy(this.restPosition);
		console.log(new THREE.Vector3().copy(this.targetPosition).sub(this.position).multiplyScalar(SCALE_SPRING));
	}

	update(delta) {
		if (this.isFocused) {
			this.targetPosition.copy(pointerPosition);
		} else {
			this.targetPosition.copy(this.restPosition);
		}

		this.scaleVelocity += (this.targetScale - this.currentScale) * SCALE_SPRING;
		this.currentScale += this.scaleVelocity *= SCALE_DAMPING;
		this.target.scale.set(this.currentScale, this.currentScale, this.currentScale);

		this.positionVelocity.add(new THREE.Vector3().copy(this.targetPosition).sub(this.position).multiplyScalar(SCALE_SPRING));
		this.position.add(this.positionVelocity.multiplyScalar(SCALE_DAMPING));
	}
}

export default ShopTarget;