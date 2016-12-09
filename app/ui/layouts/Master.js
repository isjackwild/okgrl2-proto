import React from 'react';
import PubSub from 'pubsub-js';
import ShopDetails from '../components/ShopDetails/ShopDetails.js';

const Master = () => {
	return (
		<main className="master-layout">
			<ShopDetails />
		</main>
	);
};

export default Master;

