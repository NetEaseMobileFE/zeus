/**
 * Created by jruif on 16/2/2.
 * 活动详情
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CSSModules from 'react-css-modules';
import styles from '../../css/modules/detail.scss';

import { loadDetail } from '../actions';

@CSSModules(styles, {
  allowMultiple: true
})
class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.handleModifyClick = this.handleModifyClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }
  componentDidMount() {
    this.props.loadDetail(this.props.params.id);
  }
  handleModifyClick() {

  }
  handleCancelClick() {

  }
  render() {
    const { id } = this.props.params;
    const detail = this.props.detail;
    console.log(detail)
    return (
      <div >
        <h2>活动详情</h2>
        <div>
          <div styleName="row">
            <div styleName="shrink columns">赛事名称：</div>
            <div styleName="columns">{detail.name}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">报名时间：</div>
            <div styleName="columns">{new Date(detail.signUpStart) + '~' + new Date(detail.signUpEnd)}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">赛事时间：</div>
            <div styleName="columns">{new Date(detail.gameStart) + '~' + new Date(detail.gameEnd)}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">赛事官网：</div>
            <div styleName="columns">{detail.name}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">报名项目：</div>
            <div styleName="columns">{detail.name}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">报名费用：</div>
            <div styleName="columns">{detail.name}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">报名限额：</div>
            <div styleName="columns">{detail.limitNum}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">赛事介绍：</div>
            <div styleName="columns">{detail.introduce}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">免责说明：</div>
            <div styleName="columns">{detail.disclaimer}</div>
          </div>
          <h3>网易宝信息</h3>
          <div styleName="row">
            <div styleName="shrink columns">商户帐号：</div>
            <div styleName="columns">{detail.transferAccount}</div>
          </div>
          <div styleName="row">
            <div styleName="shrink columns">商户流水号：</div>
            <div styleName="columns">{detail.name}</div>
          </div>
          <div styleName="button-group">
            <a styleName="secondary button">账单查询</a>
            <a styleName="button">查看报名</a>
            <a styleName="success button">隐藏报名数</a>
            <a styleName="warning button">修改</a>
            <a styleName="alert button">取消报名</a>
          </div>
        </div>
        <h2>邀请码</h2>
        <div styleName="row">
          <select>
            <option>1</option>
            <option>1</option>
            <option>1</option>
          </select>
          <a styleName="button">生成邀请码</a>
        </div>
        <h2>报名用户管理</h2>
        <div styleName="row">
          <div styleName="shrink columns">
            <a styleName="button">下载报名信息</a>
          </div>
          <div styleName="large-2 columns">
            <input styleName="input" type="text" />
          </div>
          <div styleName="columns">
            <a styleName="button">搜索</a>  
          </div>
        </div>
        <div styleName="users">
          <div styleName="row">
          </div>
        </div>
      </div>
    );
  }
}
DetailPage.propTypes = {
  params: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  const { id } = props.params;
  const detail = state.details[id] || {};
  console.log(state.details)
  return {
    detail
  }
}

// export default DetailPage;
export default connect(mapStateToProps, { loadDetail })(DetailPage);
