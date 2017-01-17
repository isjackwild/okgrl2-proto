import React from 'react';
import PubSub from 'pubsub-js';
// import TimelineLite from 'gsap';
import TweenLite from 'gsap';
import { renderer } from '../../../3d/loop.js';

let tween;

const onTargetFocus = () => {
	if (tween) tween.kill();
	console.log(1);
	const viewfinder = document.getElementsByClassName('camera-ui__viewfinder');
	tween = TweenLite.to(viewfinder, 0.55, {scaleX: 0.6, scaleY: 0.6, ease: Back.easeOut.config(3.5)});
}

const onTargetBlur = () => {
	if (tween) tween.kill();
	console.log(2);
	const viewfinder = document.getElementsByClassName('camera-ui__viewfinder');
	tween = TweenLite.to(viewfinder, 0.55, {scaleX: 1, scaleY: 1, ease: Back.easeOut.config(3.5)});
}
PubSub.subscribe('viewfinder.focus', onTargetFocus);
PubSub.subscribe('viewfinder.blur', onTargetBlur);

const CameraUi = ({ isVisible, isVR }) => {
	const takePhoto = () => {
		const canvas = document.getElementsByClassName('canvas')[0];
		const flash = document.getElementsByClassName('camera-ui__flash')[0];

		const portrait = window.innerHeight > window.innerWidth ? true : false;
		const toX = window.innerWidth / 2 - 25;
		const toY = portrait ? window.innerHeight / 2 - 35 : window.innerHeight / -2 + 25;

		const tl = new TimelineLite();
		tl.to(flash, 0.15, {
			opacity: 1,
		}).to(flash, 1, {
			opacity: 0,
			ease: Circ.easeOut,
		}, "+=0.07").to(canvas, 0.6, {
			scaleX: 0.05,
			scaleY: 0.05,
			rotation: -33,
			x: toX,
			y: toY,
			force3D: true,
			ease: Circ.easeOut,
		}, 0.22).to(canvas, 0.2, {
			opacity: 0,
		}, 0.5).set(canvas, {
			scaleX: 1,
			scaleY: 1,
			rotation: 0,
			x: 0,
			y: 0,
			opacity: 0,
			force3D: true,
		}).to(canvas, 0.3, {
			opacity: 1,
			ease: Sine.easeInOut,
		});
	};


	return (
		<div className={`camera-ui ${isVR ? 'camera-ui--vr' : ''}`}>
			<div className="camera-ui__viewfinder-wrapper">
				<div className="camera-ui__viewfinder"></div>
			</div>
			{ isVR ?
				<div className="camera-ui__viewfinder-wrapper">
					<div className="camera-ui__viewfinder"></div>
				</div>
				:
				null
			}
			{ !isVR ?
				<div
					className="camera-ui__trigger"
					onClick={takePhoto.bind(this)}
					onTouchStart={e => e.currentTarget.classList.add('camera-ui__trigger--touched')}
					onTouchEnd={e => e.currentTarget.classList.remove('camera-ui__trigger--touched')}
				></div>
				:
				null
			}
			{ !isVR ?
				<div className="camera-ui__flash"></div>
				:
				null
			}
		</div>
	);
};

export default CameraUi;