import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/detail.scss';

import Pagination from '../common/Pagination';

@CSSModules(styles, {
  allowMultiple: true
})
export default class InviteCode extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { detail, handleViewJoinersClick, handleGenCodeClick, inviteCodes, current, count, toPage } = this.props;
    let items = [];
    try {
      items = JSON.parse(detail.items);
    } catch(e) {

    }
    return (
      <div>
        <h2>邀请码</h2>
        <div styleName="row">
          <select styleName="medium-2 columns" ref="select">
            {
              items.map((item, i)=>{
                return <option value={`${item.name}|${item.price}`} key={i}>{`${item.name}(${item.price}元)`}</option>
              })
            }
          </select>
          <a styleName="button medium-1" onClick={() => { handleGenCodeClick(this.refs.select.value) }}>生成邀请码</a>
        </div>
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>邀请码</th>
              <th>创建人</th>
              <th>报名项目</th>
              <th>使用人</th>
            </tr>
          </thead>
          <tbody>
          {
            inviteCodes.slice((current - 1) * 2, current * 2).map((code, i) => {
              return (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{code.code}</td>
                  <td>{code.creater}</td>
                  <td>{`${code.productName}(${code.productPrice}元)`}</td>
                  <td>{code.user || '未使用'}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
        <Pagination total={Math.ceil(count / 2)} curPage={current} toPage={toPage} />
      </div>
    )
  }
}
