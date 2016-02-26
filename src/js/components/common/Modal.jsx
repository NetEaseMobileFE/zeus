/**
 * Created by jruif on 16/2/18.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/widgets/modal.scss';

@CSSModules(styles, {
  allowMultiple: true,
  errorWhenNotFound: false
})
class Modal extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  handleButtonClick(isOK) {
    this.props.hideModal(isOK);
  }

  render() {
    const { title = '提示', isShown, bodyTextCenter = false, buttonEnable = true, hideCancelButton = true } = this.props;
    return (
      <div styleName={['modal', isShown ? 'in' : ''].join(' ')}>
        <div styleName="overlay"></div>
        <div styleName="plane">
          <div styleName="inner">
            <div styleName="header">
              <h6>{title}</h6>
              <button styleName="close-button" type="button" onClick={this.handleButtonClick.bind(this, false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div styleName="body" className={(bodyTextCenter ? 'text-center' : '')}>
              {this.props.children}
            </div>
            <div styleName="footer">
              <button className={'alert button' + (buttonEnable ? '' : ' disabled')} onClick={this.handleButtonClick.bind(this, true)}>确定</button>
              {
                !hideCancelButton && (<button className="alert button hollow" onClick={this.handleButtonClick.bind(this, false)}>取消</button>)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  isShown: PropTypes.bool.isRequired,
  children: PropTypes.element,
  buttonEnable: PropTypes.bool,
  bodyTextCenter: PropTypes.bool,
  hideCancelButton: PropTypes.bool,
  hideModal: PropTypes.func.isRequired,
};

export default Modal;
