import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Pagination from '../common/Pagination';
import { loadInviteCodes, fetchCodesCount, genCode, changeCodesPage } from '../../actions/detail';

import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/detail.scss';


@CSSModules(styles, {
  allowMultiple: true
})
export default class InviteCodes extends Component {
  constructor(props) {
    super(props);
    this.RECORDS_PER_PAGE = 10;
    this.handlePageChangeClick = this.handlePageChangeClick.bind(this);
  }
  componentDidMount() {
    const { id, codes, loadInviteCodes, fetchCodesCount } = this.props;
    if (codes.length === 0) {
      loadInviteCodes(id);
      fetchCodesCount(id);
    }
  }

  // 生成邀请码
  handleGenCodeClick(data) {
    this.props.genCode({
      cid: this.props.detail.id,
      productName: data.split('|')[0],
      productPrice: data.split('|')[1]
    });
  }
  // 邀请码翻页
  handlePageChangeClick(next) {
    this.props.changeCodesPage(next, this.RECORDS_PER_PAGE);
  }
  render() {
    const { detail, codes, count, current } = this.props;
    const delta = this.RECORDS_PER_PAGE;
    let items = [];
    try {
      items = JSON.parse(detail.items);
    } catch (e) {
      console.log(e);
    }
    return (
      <div styleName="codes">
        <div className="row">
          <select className="medium-2 columns" ref="select">
            {
              items.map((item, i) => {
                return <option value={`${item.name}|${item.price}`} key={i}>{`${item.name}(${item.price}元)`}</option>;
              })
            }
          </select>
          <a className="button shrink" onClick={() => { this.handleGenCodeClick(this.refs.select.value); }}>生成邀请码</a>
        </div>
        {
          codes.length === 0 ? 
          (<div styleName="callout" className="callout warning"><h5>暂无邀请码</h5></div>)
          :
          (
            <div>
              <table styleName="table">
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
                  codes.slice((current - 1) * delta, current * delta).map((code, i) => {
                    return (
                      <tr key={i}>
                        <td>{i}</td>
                        <td>{code.code}</td>
                        <td>{code.creater}</td>
                        <td>{`${code.productName}(${code.productPrice}元)`}</td>
                        <td>{code.user || '未使用'}</td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
              <Pagination total={Math.ceil(count / delta)} curPage={current} toPage={this.handlePageChangeClick} />
            </div>
          )
        }
      </div>
    );
  }
}
InviteCodes.propTypes = {
  id: PropTypes.number.isRequired,
  codes: PropTypes.array.isRequired, 
  count: PropTypes.number.isRequired, 
  detail: PropTypes.object.isRequired, 
  current: PropTypes.number.isRequired, 
  genCode: PropTypes.func.isRequired,
  fetchCodesCount: PropTypes.func.isRequired,
  changeCodesPage: PropTypes.func.isRequired,
  loadInviteCodes: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
  const { id, detail } = props;
  let codes = [];
  let current = 0;
  let count = 0;
  if (id === state.inviteCodes.id) {
    codes = state.inviteCodes.data || [];
    count = state.inviteCodes.count;
    current = state.inviteCodes.current;
  }
  return {
    id,
    codes,
    count,
    detail,
    current,
  };
}
export default connect(mapStateToProps, { 
  loadInviteCodes, 
  fetchCodesCount,
  changeCodesPage,
  genCode 
})(InviteCodes);
