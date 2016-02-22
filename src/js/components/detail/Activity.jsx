import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/detail.scss';

import { toggleBill } from '../../actions/detail';
import { format } from '../../utils/moment';

@CSSModules(styles, {
  allowMultiple: true
})
export default class Activity extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { detail, bill, showBill, handleViewBillClick } = this.props;
    let items = [];
    try {
      items = JSON.parse(detail.items);
    } catch (e) {}
    return (
      <div>
        <h3>活动详情</h3>
        <div styleName="row">
          <div styleName="shrink columns text-right">赛事名称：</div>
          <div styleName="columns">{detail.name}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">活动状态：</div>
          <div styleName="columns">{detail.state}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">报名人数：</div>
          <div styleName="columns">{`${detail.signUpNum}/${detail.limitNum}`}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns text-right">报名时间：</div>
          <div styleName="columns">{format(detail.signUpStart) + '~' + format(detail.signUpEnd)}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">赛事时间：</div>
          <div styleName="columns">{format(detail.gameStart) + '~' + format(detail.gameEnd)}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">赛事官网：</div>
          <div styleName="columns">{detail.name}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">报名费用：</div>
          <div styleName="columns">
          {
            items.map((item) => {
              return `${item.name} ${item.price}元/人 `;
            })
          }
          </div>
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
          <div styleName="shrink columns text-right">商户帐号：</div>
          <div styleName="columns">{detail.transferAccount}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">商户流水号：</div>
          <div styleName="columns">{detail.name}</div>
        </div>
        <div>
          {showBill}
          <div>总收入： {
            bill.length > 0 && bill.reduce((pre, curr) => {
              return pre.total + curr.total;
            })
          }</div>
          <table>
            <thead>
              <tr><th>项目</th><th>收入</th><th>花钱人数</th><th>邀请码人数</th></tr>
            </thead>
            <tbody>
              {
                bill.map((item, i) => {
                  return (<tr key={i}>
                    <td>{item.productName}</td>
                    <td>{item.total}</td>
                    <td>{item.nums}</td>
                    <td>{item.codesNums}</td>
                  </tr>);
                })
              }
            </tbody>
          </table>
        </div>
        <div styleName="button-group">
          <a onClick={handleViewBillClick} styleName="secondary button">账单查询</a>
          <a styleName="success button">隐藏报名数</a>
          <a styleName="warning button">修改</a>
          <a styleName="alert button">取消报名</a>
        </div>
      </div>
    );
  }
}
Activity.propTypes = {
  detail: PropTypes.object.isRequired, 
  bill: PropTypes.array.isRequired, 
  showBill: PropTypes.bool.isRequired, 
  handleViewBillClick: PropTypes.func.isRequired
};
function mapStateToProps(state, props) {
  const { id, detail } = props;
  const showBill = state.details.showBill;
  const bill = state.details.bill;
  return {
    id,
    bill,
    detail,
    showBill
  };
}
export default connect(mapStateToProps, { handleViewBillClick: toggleBill })(Activity);
