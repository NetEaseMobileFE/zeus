/**
 * Created by jruif on 16/2/2.
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import extend from 'lodash.assign';
import moment from 'moment';
import * as createActions from '../actions/create';
import * as Ajax from '../actions/fetch';
import * as Modal from '../actions/modal';
import DropzoneComponent from 'react-dropzone-component';
import ProjectCard from './createForm/ProjectCard.jsx';
import OtherItems from './createForm/OtherItems.jsx';
import WYBinfo from './createForm/WYBinfo.jsx';
import Datetime from 'react-datetime';
import 'moment/locale/zh-cn';
import '!style!css!../../css/modules/datetime.css';
import '!style!css!sass!../../css/modules/upload.scss';
import styles from '../../css/modules/create.scss';


@CSSModules(styles, {
    allowMultiple: true
})
class Create extends Component {
    constructor(props, context) {
        super(props, context);
        let { data } = this.props;
        this.cache = {};
        this.picturesPaths = [];
        this.state = extend({},data);
    }

    componentWillMount(){
        let { type,items } = this.props.data;
        const { updateForm } = this.props.actions;
        this.types = {
            1: {
                text: '活动',
                project: []
            },
            2: {
                text: '赛事',
                project: [{
                    name: '全程马拉松',
                    price: 300
                }, {
                    name: '半程马拉松',
                    price: 200
                }, {
                    name: '10公里',
                    price: 100
                }]
            }
        };
        if(items.length === 0){
            updateForm('items',this.types[type].project);
        }
    }

    componentDidMount(){
        const { route,actions } = this.props;
        const { ajax } = this.props.ajax;
        const { modificationInit } = this.props.actions;
        if( route.location.pathname.indexOf('modification')>-1 ){
            ajax({
                url:'/get',
                body:{
                    cid:this.props.routeParams.id
                }
            },function(rs){
                ['addItems','items','pictures','requiredItems'].map((elm)=>{
                    extend(rs.data,{
                        [elm]:JSON.parse(rs.data[elm])
                    });
                });
                modificationInit(rs.data);
            });
        }
    }

    // 图片上传 属性 配置
    uploadComponentConfig() {
        return {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: '/admin/competition/imageUpload'
        }
    }

    // 图片上传 UI 配置
    uploadDjsConfig() {
        var self = this;
        return {
            paramName:'Filedata',
            addRemoveLinks: true,
            dictRemoveFile: '✘',
            dictCancelUpload:'✘',
            dictDefaultMessage: '拖拽或点击上传文件',
            params: {
                // 其他参数
                //myParameter: "I'm a parameter!"
            },
            previewTemplate: ReactDOMServer.renderToString(
                <div className="dz-preview dz-file-preview">
                    <div className="dz-image">
                        <img data-dz-thumbnail/>
                    </div>
                    <div className="dz-details">
                        <div className="dz-filename">
                            <span data-dz-name></span>
                        </div>
                    </div>
                    <div className="dz-progress">
                        <span className="dz-upload" data-dz-uploadprogress></span>
                    </div>
                    <div className="dz-success-mark"><span>✔</span></div>
                    <div className="dz-error-mark"><span>✘</span></div>
                    <div className="dz-error-message">
                        <span data-dz-errormessage></span>
                    </div>
                    <input type="text" name="description"/>
                </div>
            )
        }
    }

    // 切换类型
    switchType(event) {
        let target = event.target;
        const { updateForm } = this.props.actions;
        updateForm(target.name, target.value);
        updateForm('items', this.types[target.value].project);
    }

    // input/textarea 等获得焦点时
    focusInput(event) {
        let target = event.target;
        extend(this.cache, {
            [target.name]: target.value
        });
    }

    // 使出焦点时,更新 store 中的 state 值
    updateValue(event) {
        const { updateForm,reset } = this.props.actions;

        reset();
        let [name, value] = [event.target.name, event.target.value];
        let reg = new RegExp(name, 'g');
        if (!reg.test(['signUpStart', 'signUpEnd', 'gameStart', 'gameEnd'].join('|'))
            && this.cache[name] !== value) {
            this.cache[name] = value;
            updateForm(name, value);
        }
    }

    // @param { name }
    // @param { Moment } moment 实例
    updateTime(name, mom) {
        const { updateForm } = this.props.actions;
        updateForm(name, mom.valueOf());
        if(name === 'gameStart'){
            updateForm('gameEnd', mom.valueOf() + 24 * 60 * 60 * 1000);
        }
    }

    uploadEventHandlers() {
        //[{"path": "pic1", "description": "introduce"},{"path": "pic2", "description": "introduce"}]
        let [name, self] = ['pictures', this];
        const { addItem,removeItem } = this.props.actions;
        return {
            success(file, result){
                addItem(name, {
                    path: result.data,
                    description: ''
                });
                self.picturesPaths.push(result.data);
                file.previewElement.getElementsByTagName('input')[0].dataset.path = result.data;
            },
            removedfile(file){
                let path = JSON.parse(file.xhr.response).data;
                let index = null;
                self.picturesPaths.map((elm, i)=> {
                    if (elm === path) {
                        removeItem(name, i);
                        index = i;
                    }
                });
                self.picturesPaths.splice(index, 1);
            }
        }
    }

    updateDescription(event) {
        event.stopPropagation();
        let target = event.target;
        const { updateForm } = this.props.actions;
        this.picturesPaths.map((elm, index)=> {
            if (elm === target.dataset.path) {
                updateForm('pictures', {
                    [target.name]: target.value
                }, index);
            }
        });
    }

    submitForm(event){
        event.preventDefault();
        const { ajax } = this.props.ajax;
        const { reset } = this.props.actions;
        const { success,modal_ok } = this.props.modal;
        ajax({
            url:'/save',
            method:'POST'
        },function(result){
            // todo: 弹出alert -> 跳转到 详情页/列表页
            success(result,function(){
                reset();
                modal_ok();
            });
        });
    }
    updateStateValue(event){
        let target = event.target;
        this.setState({
            [target.name]: target.value
        });
    }
    render() {
        const { actions,data } = this.props;
        let self = this;
        let curType = self.types[this.state.type];
        return (
            <div styleName="panel">
                <div styleName="row">
                    <div styleName="columns"><h4>创建活动</h4></div>
                    <div styleName="shrink columns text-right"></div>
                </div>
                <form onBlur={this.updateValue.bind(this)}
                      onFocus={this.focusInput.bind(this)}
                      onChange={this.updateStateValue.bind(this)}>
                    <div styleName="row">
                        <div styleName="small-2 columns"></div>
                        {
                            Object.keys(self.types).map((elm, index)=>(
                                <div styleName="small-2 columns" key={ index }>
                                    <label styleName="align-spaced">
                                        <input type="radio" name="type"
                                               value={ elm } data-text={ self.types[elm].text }
                                               checked={ elm === self.state.type }
                                               onChange={self.switchType.bind(self)}/>
                                        {self.types[elm].text}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{curType.text}名称</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <input type="text" placeholder={`请填写${curType.text}名称`}
                                   name="name" value={self.state.name}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">报名日期</label>
                        </div>
                        <div styleName="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'起始日期',name:'signUpStart',readOnly:true}}
                                      value={this.state.signUpStart}
                                      onBlur={this.updateTime.bind(this,'signUpStart')}/>
                        </div>
                        <div styleName="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'结束日期',name:'signUpEnd',readOnly:true}}
                                      value={this.state.signUpEnd}
                                      onBlur={this.updateTime.bind(this,'signUpEnd')}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{curType.text}日期</label>
                        </div>
                        <div styleName="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'起始日期',name:'gameStart',readOnly:true}}
                                      value={this.state.gameStart}
                                      onChange={this.updateTime.bind(this,'gameEnd')}
                                      onBlur={this.updateTime.bind(this,'gameStart')}/>
                        </div>
                        <div styleName="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'结束日期',name:'gameEnd',readOnly:true}}
                                      value={this.state.gameEnd}
                                      onChange={this.updateTime.bind(this,'gameEnd')}
                                      onBlur={this.updateTime.bind(this,'gameEnd')}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{curType.text}官网</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <input type="text" name="siteUrl" value={self.siteUrl}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{curType.text}项目</label>
                            <label styleName="text-right middle" data-suffix=":">报名费用</label>
                        </div>
                        <ProjectCard project={data.items}
                                     actions={actions} type={self.state.type}/>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">报名限额</label>
                        </div>
                        <div styleName="small-6 medium-6 columns">
                            <input type="number" styleName="text-right"
                                   name="limitNum" value={self.state.limitNum}/>
                        </div>
                        <div styleName="small-2 medium-2 columns">
                            <label styleName="middle">人</label>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{curType.text}介绍</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <textarea rows="5" name="introduce" value={self.state.introduce}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">免责说明</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <textarea rows="5" name="disclaimer" value={self.state.disclaimer}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">上传图片</label>
                        </div>
                        <div styleName="small-8 medium-8 columns" onBlur={self.updateDescription.bind(self)}>
                            <DropzoneComponent config={this.uploadComponentConfig()}
                                               eventHandlers={this.uploadEventHandlers()}
                                               djsConfig={this.uploadDjsConfig()}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">报名填写信息</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <OtherItems actions={actions}
                                        requiredItems={this.state.requiredItems}
                                        addItems={this.state.addItems}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <h5 styleName="text-right middle" data-suffix=":">网易宝信息</h5>
                        </div>
                    </div>
                    <WYBinfo actions={actions} data={data}/>
                    <div styleName="row submit-button">
                        <div styleName="small-2 columns"></div>
                        <button type="submit" styleName="button small-2 columns" onClick={self.submitForm.bind(self)}>提交</button>
                    </div>
                </form>
            </div>
        );
    }
}

// Api: https://facebook.github.io/react/docs/reusable-components.html
Create.propTypes = {
    actions: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    modal: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    ajax: PropTypes.object.isRequired
};

export default connect(
    (state) => ({
        data: state.create,
        route: state.routeReducer
    }),
    (dispatch) => ({
        actions: bindActionCreators(createActions, dispatch),
        modal: bindActionCreators(Modal, dispatch),
        ajax: bindActionCreators(Ajax, dispatch)
    })
)(Create);
