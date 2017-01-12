const THREE = require('three');
import PubSub from 'pubsub-js';
import { ICON_PLAY_SRC } from './constants.js';
import Target from './target.js';

class VideoTarget extends Target {
	constructor({ position, settings }) {
		super();

		this.position.copy(position);
		this.settings = settings;
		this.mapSrc = ICON_PLAY_SRC;
		this.type = 'video';

		this.init();
	}

	setupTarget() {
		super.setupTarget();
		this.targetInner.position.x = 0.4;
	}

	onFocus() {
		super.onFocus();
		// if (!window.mobile) PubSub.publish('video.focus', true);
	}

	onBlur() {
		super.onBlur();
		// if (!window.mobile) PubSub.publish('video.blur', true);
	}

	onClick() {
		PubSub.publish('video.show', true);
	}
}

export default VideoTarget;