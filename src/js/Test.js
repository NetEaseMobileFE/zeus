import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../css/color2.css';


class Test1 extends Component {
  render() {
    return (
      <div className="c2">
		  <div>123</div>
      </div>
    );
  }
}

export let Test = CSSModules(Test1, styles);