import React from 'react';
import PubSub from 'pubsub-js';
import TweenMax from 'gsap';

import { VIDEO_SRC_HD, VIDEO_SRC_SD } from '../../../3d/constants.js';

const TRANSORM_SPEED = 0.6;

const view = ({ isVisible, onClick }) => {
	return (
		<div className={`video-wrapper video-wrapper--${isVisible ? 'visible' : 'hidden'}`} onClick={onClick}>
			<div className="video-wrapper__shim"></div>
		</div>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isVisible: false,
		}
		this.subs = [];

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.wrapper = undefined;
		this.shim = undefined;
		this.video = undefined;
	}

	componentWillMount() {
		this.video = document.createElement('video');
		this.video.src = window.mobile ? VIDEO_SRC_SD : VIDEO_SRC_HD;
		this.video.className = 'video';
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('video.show', this.show));
		// this.subs.push(PubSub.subscribe('video.hide', this.hide));
		this.wrapper = document.getElementsByClassName('video-wrapper')[0];
		this.shim = document.getElementsByClassName('video-wrapper__shim')[0];
		this.wrapper.appendChild(this.video);
		TweenMax.set(this.shim, { opacity: 0 });
		TweenMax.set(this.video, { y: window.innerHeight * -1, rotate: 20 });
	}

	show() {
		this.setState({ isVisible: true });
		TweenMax.to(this.shim, TRANSORM_SPEED, { opacity: 1 });
		TweenMax.to(this.video, TRANSORM_SPEED, { y: 0, rotate: 0, ease: Back.easeOut.config(1.7) });
	}

	hide() {
		this.setState({ isVisible: false });
		TweenMax.to(this.video, TRANSORM_SPEED, { y: window.innerHeight * -1, ease: Back.easeIn.config(1.4) });
		TweenMax.to(this.shim, TRANSORM_SPEED, { opacity: 0 });
		// PubSub.publish('video.hide', true);
	}

	render() {
		return <Component {...this.state} {...this.props} onClick={this.hide}/>
	}
};

const VideoOverlay = data(view);

export default VideoOverlay;