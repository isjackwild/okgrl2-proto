const THREE = require('three');
import PubSub from 'pubsub-js';
import Target from './target.js';
import TweenLite from 'gsap';

class ShopItem extends Target {
	constructor({ position, settings, link }) {
		super();

		this.position.copy(position);
		this.settings = settings;
		this.link = link;
		this.isVisible = false;

		this.init();
	}

	init() {
		super.init();
		this.scale.set(0, 0, 0);
	}

	show() {
		TweenLite.to(this.scale, 1.4, { x: 1, y: 1, z: 1, ease: Elastic.easeOut.config(0.88, 0.23) });
	}

	hide() {
		TweenLite.to(this.scale, 0.44, { x: 0.000001, y: 0.000001, z: 0.000001, ease: Back.easeIn.config(2.5) });
	}

	onFocus() {
		if (this.isFocused || window.mobile) return;
		super.onFocus();
	}

	onBlur() {
		if (!this.isFocused || window.mobile) return;
		super.onBlur();
	}

	onClick() {
		console.log('on CLICK shop item');
	}
}

export default ShopItem;