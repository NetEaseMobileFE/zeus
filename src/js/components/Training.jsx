/**
 * Created by jruif on 16/2/25.
 */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import extend from 'lodash.assign';
import styles from '../../css/modules/Training.scss';

import { routeActions } from 'react-router-redux';
import * as TrainingAction from '../actions/training';
import * as Ajax from '../actions/fetch';

import ContentItem from './runningPlan/ContentItem.jsx';

@CSSModules(styles, {
  allowMultiple: true
})
class Training extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    let { updateValue } = this.props.actions;
    let { routeParams } = this.props;
    let self = this;
    self.getDataById('/admin/category/listByPid', { pid: 0 }, (rs) => {
      updateValue('topMenu', rs.data);
      if (rs.data.length) {
        return routeParams.id || rs.data[0].id;
      }
      updateValue('content', []);
    }).then((pid) => {
      if (pid !== void 0) {
        return self.getDataById('/admin/category/listByPid', { pid }, (rs) => {
          updateValue('subMenu', rs.data);
          if (rs.data.length) {
            return routeParams.cid || rs.data[0].id;
          }
        });
      }
    }).then((cid) => {
      if (cid !== void 0) {
        return self.getDataById('/admin/runningPlan/listByCid', { cid }, (rs) => {
          updateValue('content', rs.data.map((elm) => extend({ is_editing: false }, elm)));
        });
      }
    });
  }

  getDataById(url, params, callback) {
    let { ajax } = this.props.ajax;
    return ajax({
      url,
      body: extend({}, params)
    }, callback.bind(this));
  }

  updateSubMenu(pid) {
    let { updateValue } = this.props.actions;
    let { routeParams } = this.props;
    let self = this;
    self.getDataById('/admin/category/listByPid', { pid }, (rs) => {
      updateValue('subMenu', rs.data);
      if (rs.data.length) {
        return routeParams.cid || rs.data[0].id;
      }
      updateValue('content', []);
    }).then((cid) => {
      if (cid !== void 0) {
        return self.getDataById('/admin/runningPlan/listByCid', { cid }, (rs) => {
          updateValue('content', rs.data.map((elm) => extend({ is_editing: false }, elm)));
        });
      }
    });
  }

  updateContent(cid) {
    let { updateValue } = this.props.actions;
    let self = this;
    self.getDataById('/admin/runningPlan/listByCid', { cid }, (rs) => {
      updateValue('content', rs.data.map((elm) => extend({ is_editing: false }, elm)));
    })
  }

  render() {
    let { data, routeParams, actions, ajax } = this.props;
    return (
      <div styleName="panel">
        <ul className="menu expanded" styleName="menu top-menu">
          {
            data.topMenu.map((elm, index) => (
              <li key={`top-menu-${index}`} onClick={ this.updateSubMenu.bind(this,elm.id)}
                  styleName={ +routeParams.id === elm.id && 'is-active'}>
                <Link to={`training/${elm.id}`}>{elm.name}</Link>
              </li>
            ))
          }
        </ul>
        <div className="row" styleName="panel-body">
          <div className="columns" styleName="content">
            {
              data.content.map((elm, index) => (
                <ContentItem key={`content-${routeParams.id}-${routeParams.cid}-${elm.id}`}
                             content={elm} index={index}
                             actions={actions} ajax={ajax.ajax}/>
              ))
            }
          </div>
          <div className="columns small-3" styleName="sub-menu">
            <ul className="menu vertical" styleName="menu">
              {
                data.subMenu.map((elm, index) => (
                  <li key={`sub-menu-${index}`} onClick={ this.updateContent.bind(this,elm.id)}
                      styleName={ +routeParams.cid === +elm.id && 'is-active'}>
                    <Link to={`training/${routeParams.id}/${elm.id}`}>{elm.name}</Link>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
Training.propTypes = {
  data: PropTypes.object,
  actions: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default connect(
  (state) => ({
    data: state.training,
    route: state.routeReducer
  }),
  (dispatch) => ({
    actions: bindActionCreators(TrainingAction, dispatch),
    router: bindActionCreators(routeActions, dispatch),
    ajax: bindActionCreators(Ajax, dispatch)
  })
)(Training);
