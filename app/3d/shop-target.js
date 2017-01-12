const THREE = require('three');
import PubSub from 'pubsub-js';
import Target from './target.js';
import { TARGET_RADIUS, TARGET_HITAREA_RADIUS, TARGET_FOCUS_SCALE, SCALE_SPRING, SCALE_DAMPING, TARGET_MAX_WANDER, ICON_PLUS_SRC } from './constants.js';
import { intersectableObjects } from './input-handler.js';
import ShopItem from './shop-item.js';
import TweenLite from 'gsap';

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
		this.mapSrc = ICON_PLUS_SRC;
		this.type = 'shop';

		this.init();
	}

	init() {
		super.init();
		this.setupItems();
	}

	setupItems() {
		const step = window.mobile ? 1.3 : 1.22;
		const axis = new THREE.Vector3(0, 0, 1);
		const position = new THREE.Vector3((window.mobile ? 18 : 9), 0, 0);
		if (this.items.length === 1) position.applyAxisAngle(axis, step * 0.5);
		if (this.items.length === 3) position.applyAxisAngle(axis, step * -0.5);

		this.items.forEach((details, i) => {
			const { name, url, nameMap } = details;
			console.log(name);

			const settings = {
				radius: window.mobile ? 8 : 5,
				hitAreaRadius: window.mobile ? 10 : 6,
				focusScale: TARGET_FOCUS_SCALE,
				damping: SCALE_DAMPING,
				spring: SCALE_SPRING,
				wander: TARGET_MAX_WANDER,
			}
			const item = new ShopItem({ position, settings, name, url, nameMap, i });

			this.shopItems.push(item);
			item.lookAt(0, 0, 0);
			intersectableObjects.push(item);
			this.add(item);

			position.applyAxisAngle(axis, step);
		});
	}

	onFocus() {
		if (this.isFocused) return;
		super.onFocus();

		// if (window.mobile) {
		// 	this.shopItems.forEach(item => item.show());
		// 	// clearTimeout(this.itemsTO);
		// 	// this.itemsTO = setTimeout(() => {
		// 	// 	this.shopItems.forEach(item => item.show());
		// 	// }, 222);
		// }

		if (window.mobile) this.activate(true);
	}

	onBlur() {
		if (!this.isFocused) return;
		super.onBlur();

		if (window.mobile) this.activate(false);
	}

	onClick() {
		if (!this.mobile) this.activate(!this.isActivated);
	}

	activate(activate) {
		this.isActivated = activate;

		if (this.isActivated) {
			this.shopItems.forEach(item => item.show());
			TweenLite.to(this.target.children[0].rotation, 0.33, {
				z: Math.PI / 4,
				ease: Back.easeOut.config(2.5),
			});
		} else {
			this.shopItems.forEach(item => item.hide());
			TweenLite.to(this.target.children[0].rotation, 0.33, {
				z: 0,
				ease: Back.easeOut.config(2.5),
			});
		}
	}

	update(delta) {
		super.update(delta);
		this.shopItems.forEach((item) => {
			item.update(delta);
		});
	}
}

export default ShopTarget;