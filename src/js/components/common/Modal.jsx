/**
 * Created by jruif on 16/2/18.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/Modal.scss';

@CSSModules(styles, {
  allowMultiple: true
})
class Modal extends Component {
  constructor(props, context){
    super(props, context);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  handleButtonClick(isOK){
    this.props.hideModal(isOK);
    console.log(isOK)
  }

  render(){
    const { title = '提示', isShown, hideModal, bodyTextCenter = false, buttonEnable = true, hideCancelButton = true } = this.props;
    return(
      <div styleName={["modal", isShown ? "in" : ""].join(" ")}>
        <div styleName="modal-overlay"></div>
        <div styleName="modal-plane">
          <div styleName="inner">
            <div styleName="modal-header">
              <h6>{title}</h6>
              <button styleName="close-button"
                  type="button"
                  onClick={this.handleButtonClick.bind(this, false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div styleName={'modal-body' + (bodyTextCenter ? ' text-center' : '')}>
              {this.props.children}
            </div>
            <div styleName="modal-footer">
              <button styleName={'alert button' + (buttonEnable ? '' : ' disabled')} onClick={this.handleButtonClick.bind(this, true)}>确定</button>
              {
                !hideCancelButton && (<button styleName="alert button hollow" onClick={this.handleButtonClick.bind(this, false)}>取消</button>)
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Modal.propTypes={
  title: PropTypes.string,
  isShown: PropTypes.bool.isRequired,
  buttonEnable: PropTypes.bool,
  bodyTextCenter: PropTypes.bool,
  hideCancelButton: PropTypes.bool,
  hideModal: PropTypes.func.isRequired,
};

export default Modal;