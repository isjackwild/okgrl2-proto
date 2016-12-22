const THREE = require('three');
import PubSub from 'pubsub-js';
import { ICON_PLUS_SRC } from './constants.js';
import Target from './target.js';

class VideoTarget extends Target {
	constructor({ position, settings }) {
		super();

		this.position.copy(position);
		this.settings = settings;
		this.mapSrc = ICON_PLUS_SRC;

		this.init();
	}

	onFocus() {
		super.onFocus();
		PubSub.publish('video.focus', true);
	}

	onBlur() {
		super.onBlur();
		PubSub.publish('video.blur', true);
	}

	onClick() {
		PubSub.publish('video.show', true);
	}
}

export default VideoTarget;