/**
 * Created by jruif on 16/2/18.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import Modal from './common/Modal';

class AlertModal extends Component {
  constructor(props,context){
    super(props,context);
  }

  modal_ok(){
    let { modal_cancel } = this.props.actions;
    modal_cancel();
    this.props.modal.config.onOk();
  }

  render(){
    let { msg, config, didInvalidate } = this.props.modal;
    let { modal_cancel } = this.props.actions;
    return(
      <Modal isShown={didInvalidate} hideCancleButton={config.type === 'alert'} bodyTextCenter={true} hideModal={modal_cancel}>
        {msg}
      </Modal>
    )
  }
}

AlertModal.propTypes={
  actions:PropTypes.object.isRequired,
  modal:PropTypes.object.isRequired
};

export default AlertModal;