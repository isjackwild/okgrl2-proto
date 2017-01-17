import React from 'react';
import PubSub from 'pubsub-js';
import VideoOverlay from '../components/VideoOverlay/VideoOverlay.js';
import CameraUi from '../components/CameraUi/CameraUi.js';

const view = ({ mousePressed, videoShown, targetFocused, isVR, toggleVr }) => {
	const cursor = (() => {
		if (videoShown) return 'back';
		if (targetFocused) return 'pointer';
		if (mousePressed) return 'dragging';
		return 'drag';
	})();

	return (
		<main className={`master-layout cursor--${cursor}`}>
			{ window.mobile ?
				<CameraUi isVR={isVR}/>
				:
				null
			}
			{ !isVR ?
				<VideoOverlay />
				:
				null
			}
			{ window.mobile ?
				<div className="vr-toggle" onClick={toggleVr}></div>
				:
				null
			}
		</main>
	);
};

const data = Component => class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mousePressed: false,
			videoShown: false,
			targetFocused: false,
			isVR: false,
		}
		this.subs = [];
		this.toggleVr = this.toggleVr.bind(this);
	}

	componentDidMount() {
		if (window.mobile) return;
		PubSub.subscribe('video.show', e => this.setState({ videoShown: true }));
		PubSub.subscribe('video.hide', e => this.setState({ videoShown: false }));
		PubSub.subscribe('target.focus', e => this.setState({ targetFocused: true }));
		PubSub.subscribe('target.blur', e => this.setState({ targetFocused: false }));
		window.addEventListener('mousedown', e => this.setState({ mousePressed: true }));
		window.addEventListener('mouseup', e => this.setState({ mousePressed: false }));
	}

	toggleVr() {
		window.isVR = !this.state.isVR;
		this.setState({ isVR: !this.state.isVR });
		PubSub.publish('vr.toggle', !this.state.isVR);
		document.body.classList.toggle('is-vr');
	}

	render() {
		return <Component {...this.state} {...this.props} toggleVr={this.toggleVr}/>
	}
};


const Master = data(view);

export default Master;

