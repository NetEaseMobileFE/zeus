/**
 * Created by jruif on 16/2/2.
 */
import React, { Component, PropTypes } from 'react';
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
  params: PropTypes.object.isRequired,
};

export default DetailPage;