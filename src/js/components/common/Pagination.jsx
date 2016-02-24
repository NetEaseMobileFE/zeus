import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/pagination.scss';

@CSSModules(styles, {
  allowMultiple: true
})
export default class Pagination extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(delta) {
    const { curPage, total, toPage } = this.props;
    const nextPage = curPage + delta;
    if (nextPage < 1 || nextPage > total) {
      return;
    }
    toPage(nextPage);
  }
  render() {
    const { curPage, total } = this.props;
    return (
      <div styleName="wrap">
        <span styleName="middle">{`${curPage} / ${total}`}</span>
        <a styleName={'button tiny' + (curPage === 1 ? ' disabled' : '')} onClick={this.handleClick.bind(this, -1)}>上一页</a>
        <a styleName={'button tiny' + (curPage === total ? ' disabled' : '')} onClick={this.handleClick.bind(this, 1)}>下一页</a>
      </div>
    );
  }
}
Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  curPage: PropTypes.number.isRequired,
  toPage: PropTypes.func.isRequired,
};
