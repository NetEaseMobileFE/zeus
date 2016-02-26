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
  componentWillReceiveProps(nextProps) {
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
        <ul className="tabs" styleName="tabs">
          <li className="tabs-title"><Link className={active === 'detail' ? ' is-active' : ''} to={`match/${id}/detail`}>查看活动详情</Link></li>
          <li className="tabs-title"><Link className={active === 'codes' ? ' is-active' : ''} to={`match/${id}/codes`}>查看邀请码</Link></li>
          <li className="tabs-title"><Link className={active === 'participants' ? ' is-active' : ''} to={`match/${id}/participants`}>查看报名人</Link></li>
        </ul>
        <div className="tabs-content">
          <div className="tabs-panel is-active">
            { this.props.children && React.cloneElement(this.props.children, { id, detail }) }
          </div>
        </div>
      </div>
    );
  }
}
DetailPage.propTypes = {
  id: PropTypes.object.isRequired,
  detail: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  loadDetail: PropTypes.func.isRequired,
};
function mapStateToProps(state, props) {
  const id = +props.params.id;
  const detail = state.details[id] || {};
  return {
    id,
    detail,
  };
}
export default connect(mapStateToProps, { loadDetail })(DetailPage);

export { Participants, Activity, InviteCodes };
