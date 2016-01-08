import React, { Component } from 'react';
import { NICE, SUPER_NICE } from './colors';
import CSSModules from 'react-css-modules';
import styles from '../css/color.css';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <h1 style={{ color: this.props.color }}>
        Counter ({this.props.increment}): {this.state.counter}
      </h1>
    );
  }
}

class App1 extends Component {
	constructor() {
		super();
		this.state = {}
	}
	componentDidMount() {
		require.ensure([], require => {
			this.setState({
				T: require('./Test').Test
			});
		});
	}

  render() {
	  var T = this.state.T;
    return (
      <div>
		  { T && <T/> }
        <Counter increment={1} color={NICE} />
        <Counter increment={5} color={SUPER_NICE} />
      </div>
    );
  }
}

export let App = CSSModules(App1, styles);