const THREE = require('three');
import PubSub from 'pubsub-js';
import { TARGET_RADIUS, TARGET_HITAREA_RADIUS, TARGET_FOCUS_SCALE, SCALE_SPRING, SCALE_DAMPING, TARGET_MAX_WANDER, BUBBLE_SRC } from './constants.js';
import { pointerPosition } from './input-handler.js';
import { textureLoader } from './loader.js';

const tmpVector = new THREE.Vector3();

class Target extends THREE.Object3D {
	constructor() {
		super();

		this.target = undefined;
		this.targetInner = undefined;
		this.hitArea = undefined;

		this.isFocused = false;

		this.settings = {};

		this.currentScale = 1;
		this.targetScale = 1;
		this.scaleVelocity = 0;
	}

	init() {
		if (!this.settings) {
			this.settings = {
				radius: TARGET_RADIUS,
				hitAreaRadius: TARGET_HITAREA_RADIUS,
				focusScale: TARGET_FOCUS_SCALE,
				damping: SCALE_DAMPING,
				spring: SCALE_SPRING,
				wander: TARGET_MAX_WANDER,
			}
		}

		this.targetPosition = new THREE.Vector3().copy(this.position);
		this.restPosition = new THREE.Vector3().copy(this.position);
		this.positionVelocity = new THREE.Vector3(0, 0, 0);
		this.restToTargetVector = new THREE.Vector3();

		this.setupTarget();
		this.setupHitArea();

		// this.add(new THREE.AxisHelper(5));
		this.lookAt(new THREE.Vector3(0, 0, 0));
	}

	setupTarget() {
		const geom = new THREE.PlaneGeometry(this.settings.radius * 2, this.settings.radius * 2);
		const material = new THREE.MeshStandardMaterial({
			metalness: 0,
			roughness: 0,
			map: textureLoader.load(BUBBLE_SRC),
			transparent: true,
			depthTest: false,
		});
		this.target = new THREE.Mesh(geom, material);
		this.target.renderOrder = 1;

		const scale = this.type === 'item' ? 1.4 : 1;
		const geom2 = new THREE.PlaneGeometry(this.settings.radius * scale, this.settings.radius * scale);
		const material2 = new THREE.MeshStandardMaterial({
			metalness: 0,
			roughness: 0,
			map: textureLoader.load(this.mapSrc),
			transparent: true,
			depthTest: false,
		});
		this.targetInner = new THREE.Mesh(geom2, material2);
		this.targetInner.renderOrder = 2;
		this.targetInner.position.z = 0.005;
		this.target.add(this.targetInner);

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
		material.visible = false;
		this.hitArea = new THREE.Mesh(geom, material);
		this.add(this.hitArea);
	}

	onFocus() {
		if (this.isFocused) return;
		this.isFocused = true;
		this.targetScale = this.settings.focusScale;
		this.targetPosition.copy(pointerPosition);
		PubSub.publish('target.focus', true);
		this.renderOrder = 10;
		this.target.renderOrder = 11;
		this.targetInner.renderOrder = 12;
	}

	onBlur() {
		if (!this.isFocused) return;
		this.isFocused = false;
		this.targetScale = 1;
		this.targetPosition.copy(this.restPosition);
		PubSub.publish('target.blur', true);
		this.renderOrder = 0;
		this.target.renderOrder = 1;
		this.targetInner.renderOrder = 2;
	}

	update(delta) {
		this.updatePosition(delta);
		this.updateScale(delta);
	}

	updateScale(delta) {
		this.scaleVelocity += (this.targetScale - this.currentScale) * this.settings.spring * delta;
		this.currentScale += this.scaleVelocity *= this.settings.damping;
		this.target.scale.set(this.currentScale, this.currentScale, this.currentScale);
	}

	updatePosition(delta) {
		if (this.isFocused) {
			// const tmpPointerPos = new THREE.Vector3(pointerPosition).setFromMatrixPosition(this.matrixWorld);
			this.targetPosition
				.copy(pointerPosition)
				.normalize()
				.multiplyScalar(tmpVector.copy(this.position).add(this.parent.position).length())
				.sub(this.parent.position);
			
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

		this.positionVelocity.add(new THREE.Vector3().copy(this.targetPosition).sub(this.position).multiplyScalar(this.settings.spring).multiplyScalar(delta));
		this.position.add(this.positionVelocity.multiplyScalar(this.settings.damping));
	}
}

export default Target;



