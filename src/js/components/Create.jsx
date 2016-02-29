/**
 * Created by jruif on 16/2/2.
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import { Router } from 'react-router'
import CSSModules from 'react-css-modules';
import extend from 'lodash.assign';
import moment from 'moment';
// action creator
import { routeActions } from 'react-router-redux'
import * as createActions from '../actions/create';
import * as Ajax from '../actions/fetch';
import * as Modal from '../actions/modal';
// 组件
import DropzoneComponent from 'react-dropzone-component';
import ProjectCard from './createForm/ProjectCard.jsx';
import OtherItems from './createForm/OtherItems.jsx';
import WYBinfo from './createForm/WYBinfo.jsx';
import Datetime from 'react-datetime';
import 'moment/locale/zh-cn';
// 样式
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
        this.state = extend({},data,{is_submitting:false});
        this.postUrl = '/save';
        this.is_modification = false;
    }

    componentWillMount(){
        let { type,items } = this.props.data;
        const { updateForm,reset } = this.props.actions;
        reset();
        this.types = {
            1: {
                text: '活动',
                project: []
            },
            0: {
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
        const { route } = this.props;
        const { ajax } = this.props.ajax;
        const { modificationInit } = this.props.actions;
        let self = this;
        if( route.location.pathname.indexOf('modification')>-1 ){
            this.is_modification = true;
            ajax({
                url:'/get',
                body:{
                    cid:self.props.routeParams.id
                }
            },function(rs){
                ['addItems','items','pictures','requiredItems'].map((elm)=>{
                    if(typeof rs.data[elm] === 'string' && !rs.data[elm].length){
                        if(elm === 'addItems' || elm === 'requiredItems'){
                            rs.data[elm] = "{}";
                        }else{
                            rs.data[elm] = "[]";
                        }
                    }
                    extend(rs.data,{
                        [elm]:JSON.parse(rs.data[elm])
                    });
                });
                modificationInit(rs.data);
            });
            this.postUrl = '/update';
        }
    }

    componentWillReceiveProps(nextProps){
        let data = nextProps.data;
        this.setState(extend({},data));
    }

    // 图片上传 属性 配置
    uploadComponentConfig() {
        return {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: '/admin/competition/imageUpload'
        };
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

    uploadEventHandlers() {
        //[{"path": "pic1", "description": "introduce"},{"path": "pic2", "description": "introduce"}]
        let [name, self] = ['pictures', this];
        const { addItem } = this.props.actions;
        const { pictures } = this.state;
        return {
            init(dp){
            },
            success(file, result){
                addItem(name, {
                    path: result.data,
                    description: ''
                });
                //self.picturesPaths.push({path:result.data,type:0});
                file.previewElement.getElementsByTagName('input')[0].dataset.path = result.data;
                this.removeFile(file);
            }
            //,
            //removedfile(file){
            //    //let path = JSON.parse(file.xhr.response).data;
            //    //self.removedPictures(path);
            //}
        }
    }

    removedPictures(path){
        let index = null;
        const { removeItem } = this.props.actions;
        this.state.pictures.map((elm, i)=> {
            if (elm.path === path) {
                removeItem('pictures', i);
                index = i;
            }
        });
        //this.picturesPaths.splice(index, 1);
    }

    updateDescription(event) {
        event.stopPropagation();
        let target = event.target;
        const { updateForm } = this.props.actions;
        this.state.pictures.map((elm, index)=> {
            if (elm.path === target.dataset.path) {
                updateForm('pictures', {
                    [target.name]: target.value
                }, index);
            }
        });
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
        const { updateForm } = this.props.actions;
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
        let time = mom.valueOf();
        updateForm(name, time);
        if(name === 'gameStart' && time && !this.state.gameEnd){
            updateForm('gameEnd', time + 24 * 60 * 60 * 1000);
        }
    }

    submitForm(event){
        event.preventDefault();
        let [self,addItems] = [this,this.state.addItems];
        const { ajax } = self.props.ajax;
        const { reset } = self.props.actions;
        const { success,error,modal_ok } = self.props.modal;
        const { router } = self.props;
        this.setState({
            is_submitting:true
        });
        if( Object.keys(addItems).filter((elm)=>!addItems[elm]).length ){
            self.setState({
                is_submitting:false
            });
            return error({
                msg:'添加的报名信息不能为空'
            });
        }
        ajax({
            url: this.postUrl,
            method:'POST',
            queryType:'create'
        },function(result){
            success(result,function(){
                reset();
                modal_ok();
                router.push('/applist');
            });
        }).then(()=>{
            // 防止撸管的手速重复提交
            setTimeout(()=>{
                self.setState({
                    is_submitting:false
                });
            },1500);
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
        let curType = self.types[self.state.type];
        return (
            <div className="panel">
                <div className="row">
                    <div className="columns"><h4>{this.is_modification ? '修改' : '创建'}活动</h4></div>
                    <div className="shrink columns text-right"></div>
                </div>
                <form onBlur={this.updateValue.bind(this)}
                      onFocus={this.focusInput.bind(this)}
                      onChange={this.updateStateValue.bind(this)}>
                    <div className="row">
                        <div className="small-2 columns"></div>
                        {
                            Object.keys(self.types).map((elm, index)=>(
                                <div className="small-2 columns" key={ index }>
                                    <label className="align-spaced">
                                        <input type="radio" name="type"
                                               value={ elm } data-text={ self.types[elm].text }
                                               checked={ +elm === +self.state.type }
                                               onChange={self.switchType.bind(self)}/>
                                        {self.types[elm].text}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">{curType.text}名称</label>
                        </div>
                        <div className="small-8 medium-8 columns">
                            <input type="text" placeholder={`请填写${curType.text}名称`}
                                   name="name" value={self.state.name}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">报名日期</label>
                        </div>
                        <div className="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'起始日期',name:'signUpStart',readOnly:true}}
                                      value={data.signUpStart}
                                      onChange={this.updateTime.bind(this,'signUpStart')}
                                      onBlur={this.updateTime.bind(this,'signUpStart')}/>
                        </div>
                        <div className="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'结束日期',name:'signUpEnd',readOnly:true}}
                                      value={data.signUpEnd}
                                      onChange={this.updateTime.bind(this,'signUpEnd')}
                                      onBlur={this.updateTime.bind(this,'signUpEnd')}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">{curType.text}日期</label>
                        </div>
                        <div className="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'起始日期',name:'gameStart',readOnly:true}}
                                      value={data.gameStart}
                                      onChange={this.updateTime.bind(this,'gameStart')}
                                      onBlur={this.updateTime.bind(this,'gameStart')}/>
                        </div>
                        <div className="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'结束日期',name:'gameEnd',readOnly:true}}
                                      value={data.gameEnd}
                                      onChange={this.updateTime.bind(this,'gameEnd')}
                                      onBlur={this.updateTime.bind(this,'gameEnd')}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">{curType.text}官网</label>
                        </div>
                        <div className="small-8 medium-8 columns">
                            <input type="text" name="siteUrl" value={self.state.siteUrl} placeholder="http://"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">{curType.text}项目</label>
                            <label className="text-right middle" data-suffix=":">报名费用</label>
                        </div>
                        <ProjectCard project={data.items}
                                     actions={actions}
                                     type={self.state.type}
                                     isModification={this.is_modification}/>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">报名限额</label>
                        </div>
                        <div className="small-6 medium-6 columns">
                            <input type="number" className="text-right"
                                   name="limitNum" value={self.state.limitNum}/>
                        </div>
                        <div className="small-2 medium-2 columns">
                            <label className="middle">人</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">{curType.text}介绍</label>
                        </div>
                        <div className="small-8 medium-8 columns">
                            <textarea rows="5" name="introduce" value={self.state.introduce}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">免责说明</label>
                        </div>
                        <div className="small-8 medium-8 columns">
                            <textarea rows="5" name="disclaimer" value={self.state.disclaimer}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">上传图片</label>
                        </div>
                        <div className="small-8 medium-8 columns" onBlur={self.updateDescription.bind(self)}>
                            <DropzoneComponent config={this.uploadComponentConfig()}
                                               eventHandlers={this.uploadEventHandlers()}
                                               djsConfig={this.uploadDjsConfig()}/>
                            {
                                !!self.state.pictures.length && (
                                    <div className="dropzone">
                                    {
                                        self.state.pictures.map((elm,index)=> (
                                            <div className="dz-preview dz-file-preview" key={`preview_${index}`}>
                                                <div className="dz-image">
                                                    <img src={elm.path}/>
                                                </div>
                                                <input type="text" name="description"
                                                       defaultValue={elm.description}
                                                       data-path={elm.path}/>
                                                <a className="dz-remove" href="javascript:undefined;"
                                                   onClick={self.removedPictures.bind(self,elm.path)}>✘</a>
                                            </div>
                                        ))
                                    }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="small-4 medium-2 columns">
                            <label className="text-right middle" data-suffix=":">报名填写信息</label>
                        </div>
                        <div className="small-8 medium-8 columns">
                            <OtherItems actions={actions}
                                        requiredItems={data.requiredItems}
                                        addItems={data.addItems}/>
                        </div>
                    </div>
                    {
                        !self.is_modification && ( <WYBinfo actions={actions} data={data}/> )
                    }
                    <div className="row" styleName="submit-button">
                        <div className="small-2 columns"></div>
                        <button type="submit" className="button small-2 columns"
                                onClick={self.submitForm.bind(self)} disabled={self.state.is_submitting}>提交</button>
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
        router: bindActionCreators(routeActions, dispatch),
        ajax: bindActionCreators(Ajax, dispatch)
    })
)(Create);
