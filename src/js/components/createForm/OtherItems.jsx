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
            address: {value: false, text: '收货地址'},
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

    componentWillMount() {
        this.setState({
            otherItems: this.concatOtherItems(this.props)
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            otherItems: this.concatOtherItems(nextProps)
        });
    }

    concatOtherItems(Props) {
        const { requiredItems,addItems } = Props;
        let other = extend({}, this.otherItems);
        // 无力吐槽这extend的实现了,你深度遍历下会死啊
        Object.keys(this.otherItems).map((elm)=> {
            other[elm] = extend({}, this.otherItems[elm]);
        });
        // 合并addItems到预设
        this.addItems = Object.keys(addItems).map((elm)=> {
            other[elm] = {
                value: false,
                text: addItems[elm],
                type: 1  // 1 表示为addItems元素
            };
            return elm;
        });
        Object.keys(requiredItems).map((elm)=> {
            extend(other[elm], {
                value: requiredItems[elm]
            })
        });
        return other;
    }

    updateAddItems(event) {
        event.stopPropagation();
        const { updateForm } = this.props.actions;
        let [name, value] = [event.target.name, event.target.value];
        let { addItems } = this.props;
        if (this.state.otherItems[name].type) {
            updateForm('addItems', extend({}, addItems, {
                [name]: value
            }));
        }
    }

    addOther() {
        const { updateForm } = this.props.actions;
        let name = `other_${Date.now()}`;
        let { addItems } = this.props;
        let otherItems = extend({}, this.state.otherItems, {
            [name]: {
                value: false,
                text: null,
                type: 1  // 1 表示为addItems元素
            }
        });
        this.addItems.push(name);
        updateForm('addItems', extend({}, addItems, {
            [name]: null
        }));
        this.setState({otherItems});
    }

    updateRequiredItems(event) {
        const { updateForm } = this.props.actions;
        let target = event.target;
        if (target.name === 'requiredItems') {
            event.stopPropagation();
            let [otherItems,requiredItems] = [extend({}, this.state.otherItems), {}];
            otherItems[target.value].value = target.checked;
            // 抽取 requiredItems
            Object.keys(otherItems).map((elm)=> {
                if (otherItems[elm].value) {
                    extend(requiredItems, {
                        [elm]: true
                    });
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
        let state = this.state;
        return (
            <ul styleName="other"
                onBlur={this.updateAddItems.bind(this)}>
                {
                    Object.keys(state.otherItems).map((elm, index)=>(
                        <li key={`other-${index}`}>
                            {
                                state.otherItems[elm].type ? (
                                    <div styleName="input-group">
                                        <span styleName="input-group-label">
                                            <input type="checkbox" name="requiredItems"
                                                   data-index={index} value={elm}
                                                   onChange={this.updateRequiredItems.bind(this)}
                                                   checked={state.otherItems[elm].value}/>
                                        </span>
                                        <input styleName="input-group-field"
                                               name={elm} type="text" data-index={index}
                                               value={state.otherItems[elm].text}/>
                                    </div>) : (
                                    <label>
                                        <input type="checkbox" name="requiredItems"
                                               data-index={index} value={elm}
                                               onChange={this.updateRequiredItems.bind(this)}
                                               checked={state.otherItems[elm].value}/>
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
    requiredItems: PropTypes.object.isRequired,
    addItems: PropTypes.object.isRequired
};

export default OtherItems;