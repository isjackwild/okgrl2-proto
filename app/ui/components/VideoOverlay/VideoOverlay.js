import React from 'react';
import PubSub from 'pubsub-js';
import TweenLite from 'gsap';

import { VIDEO_SRC_HD, VIDEO_SRC_SD } from '../../../3d/constants.js';

const TRANSORM_SPEED_OUT = 0.6;
const TRANSORM_SPEED_IN = 0.8;

const view = ({ isVisible, onClick }) => {
	return (
		<div className={`video-wrapper video-wrapper--${isVisible ? 'visible' : 'hidden'}`} onClick={onClick}>
			<div className="video-wrapper__shim"></div>
			
			<div className="video-wrapper__frame">
				<video
					className="video"
					poster="/assets/images/TV-poster.jpg"
					onClick={ e => e.stopPropagation() }
				></video>
			</div>

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
		this.frame = undefined;
	}

	componentDidMount() {
		this.frame = document.getElementsByClassName('video-wrapper__frame')[0];
		this.video = document.getElementsByClassName('video')[0];
		this.video.src = window.mobile ? VIDEO_SRC_SD : VIDEO_SRC_HD;
		if (window.mobile) this.video.controls = true;
		this.subs.push(PubSub.subscribe('video.show', this.show));
		this.subs.push(PubSub.subscribe('resize', this.onResize));
		this.wrapper = document.getElementsByClassName('video-wrapper')[0];
		this.shim = document.getElementsByClassName('video-wrapper__shim')[0];
		TweenLite.set(this.shim, { opacity: 0 });
		TweenLite.set(this.frame, {
			y: window.innerHeight * -1 - 150,
			rotation: (Math.random() * 20) - 10,
			force3D: true
		});
	}

	onResize() {
		if (this.state.isVisible) return;
		TweenLite.set(this.frame, {
			y: window.innerHeight * -1 - 150,
			rotation: (Math.random() * 20) - 10,
			force3D: true
		});
	}

	show() {
		TweenLite.to(this.shim, TRANSORM_SPEED_IN, { opacity: 1 });
		TweenLite.to(this.frame, TRANSORM_SPEED_IN, {
			y: 0,
			rotation: 0,
			ease: Back.easeOut.config(1.9),
			force3D: true,
			onComplete: () => {
				this.setState({ isVisible: true });
				if (!window.mobile) this.video.play();
			}
		});
		window.videoShown = true;
	}

	hide() {
		if (!this.state.isVisible) return;
		this.video.pause();
		TweenLite.to(this.frame, TRANSORM_SPEED_OUT, {
			y: window.innerHeight * -1 - 150,
			rotation: (Math.random() * 20) - 10,
			ease: Back.easeIn.config(1.3),
			force3D: true,
			onComplete: () => {
				this.setState({ isVisible: false });
				window.videoShown = false
			}
		});
		TweenLite.to(this.shim, TRANSORM_SPEED_OUT, { opacity: 0 });
		PubSub.publish('video.hide', true);
	}

	render() {
		return <Component {...this.state} {...this.props} onClick={this.hide}/>
	}
};

const VideoOverlay = data(view);

export default VideoOverlay;