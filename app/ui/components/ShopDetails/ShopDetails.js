import React from 'react';
import PubSub from 'pubsub-js';
import TweenLite from 'gsap';

const HIDDEN_SCALE = 0.8;
const TRANSORM_SPEED = 0.55;

const view = ({ isVisible, name, link }) => {
	return (
		<div className={`shop-details shop-details--${isVisible ? 'visible' : 'hidden'}`}>
			<span className="shop-item__name">{name}</span>
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
	}

	componentDidMount() {
		this.subs.push(PubSub.subscribe('shop.show', this.show));
		this.subs.push(PubSub.subscribe('shop.hide', this.hide));
		this.wrapper = document.getElementsByClassName('shop-details')[0];
		TweenLite.set(this.wrapper, { opacity: 0, scaleX: HIDDEN_SCALE, scaleY: HIDDEN_SCALE });
	}

	componentWillUnmount() {

	}

	show(e, data) {
		this.setState({ ...data, isVisible: true });
		TweenLite.to(this.wrapper, TRANSORM_SPEED, { opacity: 1, scaleX: 1, scaleY: 1, ease: Back.easeOut.config(5) });
	}

	hide() {
		this.setState({ isVisible: false });
		TweenLite.to(this.wrapper, TRANSORM_SPEED, { opacity: 0, scaleX: HIDDEN_SCALE, scaleY: HIDDEN_SCALE, ease: Back.easeOut.config(5) });
	}

	render() {
		return <Component {...this.state} {...this.props}/>
	}
};

const ShopDetails = data(view);

export default ShopDetails;