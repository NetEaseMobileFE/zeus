/**
 * Created by jruif on 16/2/2.
 * 活动详情
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/detail.scss';

@CSSModules(styles)
class DetailPage extends Component {
  render() {
    const { id } = this.props.params;
    return (
      <div>{id}</div>
    );
  }
}
DetailPage.propTypes = {
  id: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
};

export default DetailPage;
