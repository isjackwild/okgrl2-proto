import React from 'react';
import PubSub from 'pubsub-js';
import ShopDetails from '../components/ShopDetails/ShopDetails.js';
import VideoOverlay from '../components/VideoOverlay/VideoOverlay.js';

const Master = () => {
	return (
		<main className="master-layout">
			<ShopDetails />
			<VideoOverlay />
		</main>
	);
};

export default Master;

