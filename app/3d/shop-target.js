const THREE = require('three');
import PubSub from 'pubsub-js';
import Target from './target.js';
import { TARGET_RADIUS, TARGET_HITAREA_RADIUS, TARGET_FOCUS_SCALE, SCALE_SPRING, SCALE_DAMPING, TARGET_MAX_WANDER } from './constants.js';
import { intersectableObjects } from './input-handler.js';
import ShopItem from './shop-item.js';

class ShopTarget extends Target {
	constructor({ position, items, settings, i }) {
		super();

		this.position.copy(position);
		this.items = items;
		this.settings = settings;
		this.isActivated = false;
		this.itemsTO = undefined;
		this.shopItems = [];
		this.index = i;

		this.init();
	}

	init() {
		super.init();
		this.setupItems();
	}

	setupItems() {
		const axis = new THREE.Vector3(0, 0, 1);

		this.items.forEach((details, i) => {
			const { name, url, nameMap } = details;
			console.log(name);
			const position = new THREE.Vector3(10, 0, 0);
			position.applyAxisAngle(axis, 1 * i);

			const settings = {
				radius: TARGET_RADIUS,
				hitAreaRadius: TARGET_HITAREA_RADIUS,
				focusScale: TARGET_FOCUS_SCALE,
				damping: SCALE_DAMPING,
				spring: SCALE_SPRING,
				wander: TARGET_MAX_WANDER,
			}
			const item = new ShopItem({ position, settings, name, url, nameMap });

			this.shopItems.push(item);
			item.lookAt(0, 0, 0);
			intersectableObjects.push(item);
			this.add(item);
		});
	}

	onFocus() {
		if (this.isFocused) return;
		super.onFocus();

		if (window.mobile) {
			clearTimeout(this.itemsTO);
			this.itemsTO = setTimeout(() => {
				this.shopItems.forEach(item => item.show());
			}, 222);
		}
	}

	onBlur() {
		if (!this.isFocused) return;
		super.onBlur();

		if (window.mobile) {
			clearTimeout(this.itemsTO);
			this.shopItems.forEach(item => item.hide());
		}
	}

	onClick() {
		if (this.mobile) return;
		this.isActivated = !this.isActivated;

		if (this.isActivated) {
			this.shopItems.forEach(item => item.show());
		} else {
			this.shopItems.forEach(item => item.hide());
		}

		console.log(this.index);
	}

	update(delta) {
		super.update(delta);
		this.shopItems.forEach((item) => {
			item.update(delta);
		});
	}
}

export default ShopTarget;