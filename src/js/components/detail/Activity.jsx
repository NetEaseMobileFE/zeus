import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/detail.scss';
import { toggleBill, deleteMatch, updateDetail } from '../../actions/detail';
import Modal from '../common/Modal';
import STATE_MAP from '../../actions/states';
@CSSModules(styles, {
  allowMultiple: true
})
export default class Activity extends Component {
  constructor(props) {
    super(props);
    this.hideBillModal = this.hideBillModal.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDisplayClick = this.handleDisplayClick.bind(this);
    this.handleViewBillClick = this.handleViewBillClick.bind(this);
  }
  handleViewBillClick() {
    this.props.toggleBill(this.props.id);
  }
  hideBillModal() {
    this.props.toggleBill(this.props.id);
  }
  handleDeleteClick() {
    if (confirm('是否取消此赛事？')) {
      this.props.deleteMatch(this.props.id).then((json) => {
        if (json.code === 1) {
          alert('取消成功');
        } else {
          alert('取消失败');
        }
      });
    }
  }
  handleDisplayClick() {
    const display = Math.abs(this.props.detail.display - 1);
    this.props.updateDetail({ id: this.props.id, display}).then((json) => {
      if (json.code === 1) {
        alert('操作成功');
      } else {
        alert('操作成功');
      }
    });
  }
  render() {
    const { id, detail, bill, showBill } = this.props;
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
          <div styleName="columns"><span styleName={'label ' + (detail.state === 10 ? 'secondary' : 'success')}>{STATE_MAP[detail.state]}</span></div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">前台是否显示报名人数：</div>
          <div styleName="columns">
          {detail.display === 1 ? <span styleName="label success">显示</span> : <span styleName="label secondary">隐藏</span>}
          </div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">报名人数：</div>
          <div styleName="columns">{`${detail.signUpNum || 0}/${detail.limitNum}`}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns text-right">报名时间：</div>
          <div styleName="columns">{moment(detail.signUpStart).format('YYYY-MM-DD') + '~' + moment(detail.signUpEnd).format('YYYY-MM-DD')}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">赛事时间：</div>
          <div styleName="columns">{moment(detail.gameStart).format('YYYY-MM-DD') + '~' + moment(detail.gameEnd).format('YYYY-MM-DD')}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">赛事官网：</div>
          <div styleName="columns">{detail.siteUrl}</div>
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
          <div styleName="columns">{detail.tenantAccount}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">商户流水号：</div>
          <div styleName="columns">{detail.plateformId}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">16位公钥：</div>
          <div styleName="columns key">{detail.publickey}</div>
        </div>
        <div styleName="row">
          <div styleName="shrink columns">16位私钥：</div>
          <div styleName="columns key">{detail.privkey}</div>
        </div>
        <Modal title="账单查询" isShown={showBill} hideCancleButton={true} hideModal={this.hideBillModal}>
          <div>
            总收入： {
              bill.length > 0 && bill.reduce((pre, curr) => {
                return { total: pre.total || 0 + curr.total || 0 };
              }).total
            }
            <table>
              <thead>
                <tr><th>项目</th><th>收入</th><th>花钱人数</th><th>邀请码人数</th></tr>
              </thead>
              <tbody>
                {
                  bill.length > 0 && bill.map((item, i) => {
                    return (<tr key={i}>
                      <td>{item.productName}</td>
                      <td>{item.total}</td>
                      <td>{item.signUpNums}</td>
                      <td>{item.codeNums}</td>
                    </tr>);
                  })
                }
              </tbody>
            </table>
          </div>
        </Modal>
        <div styleName="button-group">
          <a onClick={this.handleViewBillClick} styleName="secondary button">账单查询</a>
          {detail.display === 1}
          <a onClick={this.handleDisplayClick} styleName="success button">{(detail.display === 1 ? '隐藏' : '显示') + '报名人数'}</a>
          <Link styleName="warning button" to={`modification/${id}`}>修改</Link>
          <a onClick={this.handleDeleteClick} styleName={'alert button' + (detail.state === 10 ? ' disabled' : '')}>取消报名</a>
        </div>
      </div>
    );
  }
}
Activity.propTypes = {
  detail: PropTypes.object.isRequired, 
  bill: PropTypes.array.isRequired, 
  showBill: PropTypes.bool.isRequired, 
  toggleBill: PropTypes.func.isRequired
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
export default connect(mapStateToProps, { toggleBill, deleteMatch, updateDetail })(Activity);
