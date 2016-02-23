import Participants from './Participants';
import Activity from './Activity';
import InviteCodes from './InviteCodes';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { loadDetail } from '../../actions/detail';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/detail.scss';

@CSSModules(styles, {
  allowMultiple: true
})
class DetailPage extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.loadDetail(this.props.id);
  }
  componentWillReceiveProps(nextProps){
    if (+nextProps.id !== +this.props.id) {
      this.props.loadDetail(nextProps.id);
    }
  }

  render() {
    const { id, detail, location } = this.props;
    let active = location.pathname.match(/\/(\w+?)$/)[1];
    if (active !== 'codes' && active !== 'participants') {
      active = 'detail';
    }
    return (
      <div>
        <ul styleName="tabs">
              
          <li styleName={'tabs-title' + (active === 'detail' ? ' is-active' : '')}><Link to={`match/${id}/detail`}>查看活动详情</Link></li>
          <li styleName={'tabs-title' + (active === 'codes' ? ' is-active' : '')}><Link to={`match/${id}/codes`}>查看邀请码</Link></li>
          <li styleName={'tabs-title' + (active === 'participants' ? ' is-active' : '')}><Link to={`match/${id}/participants`}>查看报名人</Link></li>
        </ul>
        <div styleName="tabs-content">
          <div styleName="tabs-panel is-active">
            { this.props.children && React.cloneElement(this.props.children, { id, detail }) }
          </div>
        </div>
      </div>
    );
  }
}
DetailPage.propTypes = {
};
function mapStateToProps(state, props) {
  const { id } = props.params;
  const detail = state.details[id] || {};
  return {
    id,
    detail,
  }
}
export default connect(mapStateToProps, { loadDetail })(DetailPage);

export { Participants, Activity, InviteCodes};
