import React from 'react';
import PubSub from 'pubsub-js';
// import TimelineLite from 'gsap';
import TweenLite from 'gsap';
import { renderer } from '../../../3d/loop.js';

const CameraUi = ({ isVisible, name, link }) => {
	const takePhoto = () => {
		const canvas = document.getElementsByClassName('canvas')[0];
		const flash = document.getElementsByClassName('camera-ui__flash')[0];
		// const wrapper = document.getElementsByClassName('camera-ui')[0];
		// const newCanvas = document.createElement('canvas');
		// newCanvas.className = 'camera-ui__photo';
		
		// const ctx = newCanvas.getContext('2d');
		// ctx.drawImage(canvas, 0, 0);
	
		// const src = renderer.domElement.toDataURL("image/jpeg");
		// const image = new Image();
		// image.src = src;
		// image.className = 'camera-ui__photo';
		// image.onload = () => {
		// 	wrapper.appendChild(image);

		// 	TweenLite.to(image, 1, {
		// 		scaleX: 0.05,
		// 		scaleY: 0.05,
		// 		rotation: -23,
		// 		x: window.innerWidth / 2 - 25,
		// 		y: window.innerHeight / -2 + 25,
		// 		force3D: true,
		// 		// onComplete: () => wrapper.removeChild(image),
		// 	});
		// }
		// 
		
		// const reset = () => {
		// 	TweenLite.set(canvas, {
		// 		scaleX: 1,
		// 		scaleY: 1,
		// 		rotation: 0,
		// 		x: 0,
		// 		y: 0,
		// 	});
		// }

		// console.log(flash, canvas);

		// const tl = new TimelineLite();
		// tl.to(flash, 0.1, {
		// 	opacity: 1,
		// }).to(flash, 0.7, {
		// 	opacity: 0,
		// }).to(canvas, 0.7, {
		// 	scaleX: 0.05,
		// 	scaleY: 0.05,
		// 	rotation: -23,
		// 	x: window.innerWidth / 2 - 25,
		// 	y: window.innerHeight / -2 + 25,
		// 	force3D: true,
		// 	// onComplete: reset,
		// }); 
		// WHY IS THIS SAYING CANNOT TWEEN NULL TARGET?
		
		// TweenLite.to(flash, 0.15, {
		// 	opacity: 1,
		// });

		// TweenLite.to(flash, 1, {
		// 	opacity: 0,
		// 	delay: 0.15,
		// });

		// TweenLite.to(canvas, 0.66, {
		// 	scaleX: 0.05,
		// 	scaleY: 0.05,
		// 	rotation: -23,
		// 	x: window.innerWidth / 2 - 25,
		// 	y: window.innerHeight / -2 + 25,
		// 	force3D: true,
		// 	onComplete: reset,
		// });


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
			x: window.innerWidth / 2 - 25,
			y: window.innerHeight / -2 + 25,
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
		<div className="camera-ui">
			<div className="camera-ui__viewfinder"></div>
			<div className="camera-ui__trigger" onClick={takePhoto.bind(this)}></div>
			<div className="camera-ui__flash"></div>
		</div>
	);
};

export default CameraUi;