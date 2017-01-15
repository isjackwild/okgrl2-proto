const THREE = require('three');
import PubSub from 'pubsub-js';
import Target from './target.js';
import TweenLite from 'gsap';

// const openLinkIOS = (url) => {
// 	const a = document.createElement("a");
// 	a.target = "_blank";
// 	a.href = url;

// 	console.log(url);

// 	const e = window.document.createEvent("MouseEvents");
// 	e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
// 	a.dispatchEvent(e);
// }

class ShopItem extends Target {
	constructor({ position, settings, url, nameMap, i }) {
		super();

		this.position.copy(position);
		this.settings = settings;
		this.url = url;
		this.isVisible = false;
		this.mapSrc = nameMap;
		this.type = 'item';
		this.index = i;

		this.init();
	}

	init() {
		super.init();
		this.scale.set(0.0001, 0.0001, 0.0001);
	}

	show() {
		TweenLite.to(this.scale, 1.4, {
			x: 1,
			y: 1,
			z: 1,
			ease: Elastic.easeOut.config(0.5, 0.2),
			delay: this.index * 0.13,
		});
		this.bringToFront();
	}

	hide() {
		TweenLite.to(this.scale, 0.33, {
			x: 0.000001,
			y: 0.000001,
			z: 0.000001,
			ease: Back.easeIn.config(2.7),
			delay: this.index * 0.13,
		});
		this.resetRenderOrder();
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
		if (window.mobile) {
			// openLinkIOS(this.url);
			window.location.href = this.url;
		} else {
			const win = window.open(this.url, '_blank');
			win.focus();
		}
	}
}

export default ShopItem;