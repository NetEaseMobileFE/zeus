/**
 * Created by jruif on 16/2/5.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/Datetime.scss';
import Datetime from 'react-datetime';
import moment from 'moment'
import 'moment/locale/zh-cn'

@CSSModules(styles)
class Datetime extends Component {
    constructor(props, reply) {
        super(props, reply);
        this.state = {
            value: this.props.value || ''
        }
    }
    handleChange(e) {
        this.setState({value: e.target.value})
    }
    showDatePick(){
        //todo...
    }
    render() {
        return (
            <div styleName="row">
                <div styleName="small-4 medium-2 columns">
                    <label styleName="text-right middle" data-suffix=":">{state.text}名称</label>
                </div>
                <div styleName="small-8 medium-5 columns">
                    <input type="text"  value={this.state.value}
                           onChange={this.handleChange.bind(this)}
                           onFocus={this.showDatePick.bind(this)}/>
                </div>
                <Datetime input={true} locale="zh-cn"/>
            </div>

        )
    }
}
Datetime.propTypes = {
    value:PropTypes.string
};

export default Datetime;