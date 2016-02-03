/**
 * Created by jruif on 16/2/2.
 */
import React, { Component, PropTypes } from 'react';
class Header extends Component {
  render() {
    let { info } = this.props;
    return (
      <header>
        顶部{info.name},退出
      </header>
    );
  }
}
Header.propTypes = {
  info: PropTypes.object,
};

export default Header;
