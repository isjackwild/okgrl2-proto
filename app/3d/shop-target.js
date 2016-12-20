const THREE = require('three');
import PubSub from 'pubsub-js';
import Target from './target.js';
import { TARGET_RADIUS, TARGET_HITAREA_RADIUS, TARGET_FOCUS_SCALE, SCALE_SPRING, SCALE_DAMPING, TARGET_MAX_WANDER } from './constants.js';
import { intersectableObjects } from './input-handler.js';
import ShopItem from './shop-item.js';

class ShopTarget extends Target {
	constructor({ position, details, settings }) {
		super();

		this.position.copy(position);
		this.details = details;
		this.settings = settings;
		this.isActivated = false;
		this.itemsTO = undefined;
		this.items = [];

		this.init();
	}

	init() {
		super.init();
		this.setupItems();
	}

	setupItems() {
		const position = new THREE.Vector3(10, 0, 0);
		const settings = {
			radius: TARGET_RADIUS,
			hitAreaRadius: TARGET_HITAREA_RADIUS,
			focusScale: TARGET_FOCUS_SCALE,
			damping: SCALE_DAMPING,
			spring: SCALE_SPRING,
			wander: TARGET_MAX_WANDER,
		}
		const item = new ShopItem({ position, settings });
		this.items.push(item);

		this.items.forEach((item) => {
			item.lookAt(0, 0, 0);
			this.add(item);
			intersectableObjects.push(item);
		});
	}

	onFocus() {
		if (this.isFocused) return;
		super.onFocus();
		PubSub.publish('shop.show', this.details);

		if (window.mobile) {
			clearTimeout(this.itemsTO);
			this.itemsTO = setTimeout(() => {
				this.items.forEach(item => item.show());
			}, 222);
		}
	}

	onBlur() {
		if (!this.isFocused) return;
		super.onBlur();
		PubSub.publish('shop.hide', false);

		if (window.mobile) {
			clearTimeout(this.itemsTO);
			this.items.forEach(item => item.hide());
		}
	}

	onClick() {
		if (this.mobile) return;
		this.isActivated = !this.isActivated;

		if (this.isActivated) {
			this.items.forEach(item => item.show());
		} else {
			this.items.forEach(item => item.hide());
		}
	}

	update(delta) {
		super.update(delta);
		this.items.forEach((item) => {
			item.update(delta);
		});
	}
}

export default ShopTarget;