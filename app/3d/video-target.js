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

		this.onVRToggle = this.onVRToggle.bind(this);
		PubSub.subscribe('vr.toggle', this.onVRToggle);

		this.init();
	}

	setupTarget() {
		super.setupTarget();
		this.targetInner.position.x = 0.4;
	}

	onFocus() {
		if (this.isFocused) return;
		super.onFocus();
		PubSub.publish('viewfinder.focus');
		// if (!window.mobile) PubSub.publish('video.focus', true);
	}

	onBlur() {
		if (!this.isFocused) return;
		super.onBlur();
		PubSub.publish('viewfinder.blur');
		// if (!window.mobile) PubSub.publish('video.blur', true);
	}

	onClick() {
		if (!window.isVR) super.onClick();
	}

	onVRToggle(e, isVR) {
		if (isVR) return this.visible = false;
		this.visible = true;
	}

	update(delta) {
		if (!window.isVR) super.update(delta);
	}

	onClick() {
		PubSub.publish('video.show', true);
	}
}

export default VideoTarget;