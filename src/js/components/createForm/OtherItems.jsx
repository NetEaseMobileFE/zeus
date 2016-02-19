/**
 * Created by jruif on 16/2/17.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import extend from 'lodash.assign';
import styles from '../../../css/modules/OtherItems.scss';

@CSSModules(styles, {
    allowMultiple: true
})
class OtherItems extends Component {
    constructor(props, context) {
        super(props, context);
        this.otherItems = {
            name: {value: false, text: '用户名称'},
            birthday: {value: false, text: '生日'},
            sex: {value: false, text: '性别'},
            idCard: {value: false, text: '身份证'},
            phoneNum: {value: false, text: '手机号'},
            eMail: {value: false, text: '邮箱'},
            address: {value: false, text: '收费地址'},
            height: {value: false, text: '身高'},
            weight: {value: false, text: '体重'},
            dressSize: {value: false, text: '衣服尺寸'},
            shoesSize: {value: false, text: '鞋码'},
            emergencyName: {value: false, text: '紧急联系人'},
            emergencyPhone: {value: false, text: '紧急联系人电话'},
            takePartName: {value: false, text: '是否参加过其它马拉松项目'}
        };
        this.addItems = [];
    }

    concatOtherItems() {
        const { requiredItems,addItems } = this.props;
        let otherItems = this.otherItems;
        // 合并addItems到预设
        this.addItems = addItems.map((elm)=> {
            let key = Object.keys(elm)[0];
            otherItems[key] = {
                value: false,
                text: elm[key],
                type: 1  // 1 表示为addItems元素
            };
            return key;
        });
        requiredItems.map((elm)=> {
            let key = Object.keys(elm)[0];
            otherItems[key].value = elm[key];
        });
        return otherItems;
    }

    componentWillMount() {
        this.setState({
            otherItems: this.concatOtherItems()
        });
    }

    updateAddItems(event) {
        event.stopPropagation();
        const { updateForm } = this.props.actions;
        let [name, value] = [event.target.name, event.target.value];
        if (name.indexOf('other_') === 0) {
            this.addItems.map((elm, index)=> {
                if (elm === name) {
                    updateForm('addItems', {
                        [name]: value
                    }, index);
                }
            });
        }
    }

    addOther() {
        const { addItem } = this.props.actions;
        let key = `other_${Date.now()}`;
        let otherItems = extend({}, this.state.otherItems, {
            [key]: {
                value: false,
                text: null,
                type: 1  // 1 表示为addItems元素
            }
        });
        this.addItems.push(key);
        addItem('addItems', {[key]: null});
        this.setState({otherItems});
    }

    updateRequiredItems(event) {
        const { updateForm } = this.props.actions;
        let target = event.target;
        if (target.name === 'requiredItems') {
            event.stopPropagation();
            let [otherItems,requiredItems] = [this.state.otherItems, []];
            otherItems[target.value].value = target.checked;
            // 抽取 requiredItems
            Object.keys(otherItems).map((elm)=> {
                if (otherItems[elm].value) {
                    requiredItems.push({[elm]: true});
                }
            });
            // 更新 store.state中的状态值
            updateForm(target.name, requiredItems);
            // 更新 state & UI
            this.setState({
                otherItems
            });
        }
    }

    render() {
        let { }=this.props;
        let state = this.state;
        return (
            <ul styleName="other"
                onChange={this.updateRequiredItems.bind(this)}
                onBlur={this.updateAddItems.bind(this)}>
                {
                    Object.keys(state.otherItems).map((elm, index)=>(
                        <li key={`other-${index}`}>
                            {
                                state.otherItems[elm].type ? (
                                    <div styleName="input-group">
                                        <span styleName="input-group-label">
                                            {
                                                state.otherItems[elm].value ?
                                                    <input type="checkbox" name="requiredItems"
                                                           data-index={index} value={elm} defaultChecked/> :
                                                    <input type="checkbox" name="requiredItems"
                                                           data-index={index} value={elm}/>
                                            }
                                        </span>
                                        <input styleName="input-group-field"
                                               name={elm} type="text" data-index={index}
                                               defaultValue={state.otherItems[elm].text}/>
                                    </div>) : (
                                    <label>
                                        {
                                            state.otherItems[elm].value ?
                                                <input type="checkbox" name="requiredItems"
                                                       data-index={index} value={elm} defaultChecked/> :
                                                <input type="checkbox" name="requiredItems"
                                                       data-index={index} value={elm}/>
                                        }
                                        {state.otherItems[elm].text}
                                    </label>)
                            }
                        </li>
                    ))
                }
                <li><a styleName="button secondary" onClick={this.addOther.bind(this)}>+</a></li>
            </ul>
        )
    }
}
OtherItems.propTypes = {
    actions: PropTypes.object.isRequired,
    requiredItems: PropTypes.array.isRequired,
    addItems: PropTypes.array.isRequired
};

export default OtherItems;