/**
 * Created by jruif on 16/2/17.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/WYBinfo.scss';

@CSSModules(styles, {
  allowMultiple: true
})
class WYBinfo extends Component {
  constructor(props, context) {
    super(props, context);
  }

  switchTenant(event) {
    const { updateForm } = this.props.actions;
    let target = event.target;
    updateForm(target.name, target.value);
  }

  render() {
    let { defaultTenant, tenantAccount, privkey, publickey, plateformId } = this.props.data;
    return (
      <div>
        <div className="row">
          <div className="small-4 medium-2 columns">
            <h5 className="text-right middle" data-suffix=":">网易宝信息</h5>
          </div>
        </div>
        <div className="row" onChange={this.switchTenant.bind(this)}>
          <div className="small-2 columns"></div>
          <div className="small-3 columns">
            <label className="align-spaced">
              <input type="radio" name="defaultTenant"
                   value="0" defaultChecked/>
              默认帐号
            </label>
          </div>
          <div className="small-3 columns">
            <label className="align-spaced">
              <input type="radio" name="defaultTenant"
                   value="1"/>
              新增收款帐号
            </label>
          </div>
        </div>
        {
          defaultTenant === '1' && (
            <div>
              <div className="row">
                <div className="small-4 medium-2 columns">
                  <label className="text-right middle" data-suffix=":">商户帐号</label>
                </div>
                <div className="small-8 medium-8 columns">
                  <input type="text" name="tenantAccount" defaultValue={tenantAccount}/>
                </div>
              </div>
              <div className="row">
                <div className="small-4 medium-2 columns">
                  <label className="text-right middle" data-suffix=":">商户流水号</label>
                </div>
                <div className="small-8 medium-8 columns">
                  <input type="text" name="plateformId" defaultValue={plateformId}/>
                </div>
              </div>
              <div className="row">
                <div className="small-4 medium-2 columns">
                  <label className="text-right middle" data-suffix=":">16位公钥</label>
                </div>
                <div className="small-8 medium-8 columns">
                  <textarea rows="5" name="publickey" defaultValue={publickey}/>
                </div>
              </div>
              <div className="row">
                <div className="small-4 medium-2 columns">
                  <label className="text-right middle" data-suffix=":">16位私钥</label>
                </div>
                <div className="small-8 medium-8 columns">
                  <textarea rows="5" name="privkey" defaultValue={privkey}/>
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

WYBinfo.propTypes = {
  actions: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default WYBinfo;
