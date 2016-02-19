/**
 * Created by jruif on 16/2/18.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/Modal.scss';

@CSSModules(styles, {
    allowMultiple: true
})
class Modal extends Component {
    constructor(props,context){
        super(props,context);
    }

    modal_ok(){
        let { modal_cancel } = this.props.actions;
        modal_cancel();
        this.props.modal.onOk();
    }

    render(){
        let { msg, modal,invalidate } = this.props;
        let { modal_cancel } = this.props.actions;
        return(
            <div styleName="modal">
                <div styleName="modal-overlay"></div>
                <div styleName="modal-plane">
                    <div styleName="modal-header">
                        <h6>提示</h6>
                        <button styleName="close-button"
                                type="button"
                                onClick={modal_cancel}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div styleName="modal-body">
                        {msg}
                    </div>
                    <div styleName="modal-footer">
                        {
                            modal.type === 'alert' ? '':<button styleName="alert button hollow" onClick={modal_cancel}>取消</button>
                        }
                        <button styleName="alert button" onClick={this.modal_ok.bind(this)}>确定</button>
                    </div>
                </div>
            </div>
        )
    }
}

Modal.propTypes={
    msg:PropTypes.string.isRequired,
    actions:PropTypes.object.isRequired,
    invalidate:PropTypes.bool.isRequired,
    modal:PropTypes.object.isRequired
};

export default Modal;