const THREE = require('three');
import Target from './target.js';

class ShopTarget extends Target {
	constructor({ position, details }) {
		super();

		this.position.copy(position);
		this.details = details;

		this.init();
	}

	onFocus() {
		super.onFocus();
	}

	onBlur() {
		super.onBlur();
	}
}

export default ShopTarget;