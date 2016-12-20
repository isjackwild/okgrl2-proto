const THREE = require('three');
import PubSub from 'pubsub-js';
import { TARGET_RADIUS, TARGET_HITAREA_RADIUS, TARGET_FOCUS_SCALE, SCALE_SPRING, SCALE_DAMPING, TARGET_MAX_WANDER } from './constants.js';
import { pointerPosition } from './input-handler.js';

class Target extends THREE.Object3D {
	constructor() {
		super();

		this.target = undefined;
		this.hitArea = undefined;

		this.isFocused = false;

		this.settings = {
			radius: TARGET_RADIUS,
			hitAreaRadius: TARGET_HITAREA_RADIUS,
			focusScale: TARGET_FOCUS_SCALE,
			damping: SCALE_DAMPING,
			spring: SCALE_SPRING,
			wander: TARGET_MAX_WANDER,
		}

		this.currentScale = 1;
		this.targetScale = 1;
		this.scaleVelocity = 0;
	}

	init() {
		this.targetPosition = new THREE.Vector3().copy(this.position);
		this.restPosition = new THREE.Vector3().copy(this.position);
		this.positionVelocity = new THREE.Vector3(0, 0, 0);
		this.restToTargetVector = new THREE.Vector3();

		this.setupTarget();
		this.setupHitArea();

		this.add(new THREE.AxisHelper(5));
		this.lookAt(new THREE.Vector3(0, 0, 0));
	}

	setupTarget() {
		const geom = new THREE.PlaneGeometry(this.settings.radius * 2, this.settings.radius * 2);
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
		const geom = new THREE.SphereGeometry(this.settings.hitAreaRadius, 20, 20);
		const material = new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			metalness: 0,
			roughness: 0,
			transparent: true,
			opacity: 0.2,
		});
		// material.visible = false;
		this.hitArea = new THREE.Mesh(geom, material);
		this.add(this.hitArea);
	}

	onFocus() {
		if (this.isFocused) return;
		this.isFocused = true;
		this.targetScale = this.settings.focusScale;
		this.targetPosition.copy(pointerPosition);
		PubSub.publish('target.focus', true);
	}

	onBlur() {
		if (!this.isFocused) return;
		this.isFocused = false;
		this.targetScale = 1;
		this.targetPosition.copy(this.restPosition);
		PubSub.publish('target.blur', true);
	}

	update(delta) {
		if (this.isFocused) {
			this.targetPosition
				.copy(pointerPosition)
				.normalize()
				.multiplyScalar(this.position.length());

			this.restToTargetVector
				.copy(this.targetPosition)
				.sub(this.restPosition);
			const scalar = window.mobile ? 1 : 1 - (this.restToTargetVector.length() / this.settings.wander);
			this.restToTargetVector
				.multiplyScalar(Math.max(0, scalar))
				.clampLength(0, this.settings.wander);
			this.targetPosition.copy(this.restPosition).add(this.restToTargetVector);
		} else {
			this.targetPosition.copy(this.restPosition);
		}


		this.scaleVelocity += (this.targetScale - this.currentScale) * this.settings.spring * delta;
		this.currentScale += this.scaleVelocity *= this.settings.damping;
		this.target.scale.set(this.currentScale, this.currentScale, this.currentScale);

		this.positionVelocity.add(new THREE.Vector3().copy(this.targetPosition).sub(this.position).multiplyScalar(this.settings.spring).multiplyScalar(delta));
		this.position.add(this.positionVelocity.multiplyScalar(this.settings.damping));
	}
}

export default Target;



