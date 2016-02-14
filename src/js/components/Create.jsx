/**
 * Created by jruif on 16/2/2.
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import * as createActions from '../actions/create';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/create.scss';
import Datetime from 'react-datetime';
import DropzoneComponent from 'react-dropzone-component'
import ProjectCard from './form/ProjectCard.jsx'
import moment from 'moment'
import 'moment/locale/zh-cn'
import '!style!css!../../css/modules/datetime.css'
import '!style!css!sass!../../css/modules/upload.scss'


@CSSModules(styles, {
    allowMultiple: true
})
class Create extends Component {
    constructor(props, context) {
        super(props, context);
    }
    componentWillMount() {
        this.setState({
            types: [
                {
                    value: '2',
                    text: '活动',
                    project: []
                }, {
                    value: '1',
                    text: '赛事',
                    project: [{
                        name:'全程马拉松',
                        price: 300
                    },{
                        name:'半程马拉松',
                        price: 200
                    },{
                        name:'10公里',
                        price: 100
                    }]
                }
            ],
            choose: '2',
            text: '活动',
            project: []
        });
    }

    uploadComponentConfig(){
        return {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: '/uploadHandler'
        }
    }

    uploadDjsConfig(){
        return {
            addRemoveLinks: true,
            dictRemoveFile:'✘',
            dictDefaultMessage:'拖拽或点击上传文件',
            params: {
                myParameter: "I'm a parameter!"
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
                    <input type="text" name=""/>
                </div>
            )
        }
    }

    switchType(event) {
        let target = event.target;
        const { updateForm } = this.props.actions;
        this.state.types.map((elm)=>{
            if(target.value === elm.value){
                this.setState({
                    choose: elm.value,
                    text: elm.text,
                    project: elm.project
                });
                console.log(this.state.project)
            }
        });
        updateForm(target.name,target.value);
    }

    updateValue(event){
        const { updateForm } = this.props.actions;
        updateForm(event.target.name,event.target.value);
    }

    uploadEventHandlers(){
        let name = 'pictures';
        const { updateForm } = this.props.actions;
        return {
            success(file,result){
                updateForm(name,result.data);
            },
            removedfile(file){
                updateForm(name,JSON.parse(file.xhr.response).data)
            }
        }
    }

    render() {
        const { actions,data } = this.props;
        let self = this;
        let state = self.state;
        return (
            <div styleName="panel">
                <div styleName="row">
                    <div styleName="columns"><h4>创建活动</h4></div>
                    <div styleName="shrink columns text-right"></div>
                </div>
                <form onBlur={this.updateValue.bind(this)}>
                    <div styleName="row">
                        <div styleName="small-2 columns"></div>
                        {
                            state.types.map((elm, index)=>(
                                <div styleName="small-2 columns" key={ index }>
                                    <label styleName="align-spaced">
                                        <input type="radio" name="type"
                                               value={ elm.value } data-text={ elm.text }
                                               checked={ elm.value === state.choose }
                                               onChange={self.switchType.bind(self)}/>
                                        {elm.text}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{state.text}名称</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <input type="text" placeholder={`请填写${state.text}名称`}
                                   name="name" defaultValue={data.name}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">报名日期</label>
                        </div>
                        <div styleName="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'起始日期',name:'signUpStart'}}
                                      defaultValue={data.signUpStart}/>
                        </div>
                        <div styleName="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'结束日期',name:'signUpEnd'}}
                                      defaultValue={data.signUpEnd}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{state.text}日期</label>
                        </div>
                        <div styleName="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'起始日期',name:'gameStart'}}
                                      defaultValue={data.gameStart}/>
                        </div>
                        <div styleName="small-8 medium-4 columns">
                            <Datetime input={true} locale="zh-cn"
                                      inputProps={{placeholder:'结束日期',name:'gameEnd'}}
                                      defaultValue={data.gameEnd}/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{state.text}官网</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <input type="text" defaultValue="http://"/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{state.text}项目</label>
                            <label styleName="text-right middle" data-suffix=":">报名费用</label>
                        </div>
                        <ProjectCard project={state.project} action={actions}/>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">报名限额</label>
                        </div>
                        <div styleName="small-6 medium-6 columns">
                            <input type="number" styleName="text-right"
                                   name="limitNum" defaultValue={data.limitNum}/>
                        </div>
                        <div styleName="small-2 medium-2 columns">
                            <label styleName="middle">人</label>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">{state.text}介绍</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <textarea rows="5" name="introduce"/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">免责说明</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <textarea rows="5" name="disclaimer"/>
                        </div>
                    </div>
                    <div styleName="row">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">上传图片</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <DropzoneComponent config={this.uploadComponentConfig()}
                                               eventHandlers={this.uploadEventHandlers()}
                                               djsConfig={this.uploadDjsConfig()}/>
                        </div>
                    </div>
                    <div styleName="row margin-top-20">
                        <div styleName="small-4 medium-2 columns">
                            <label styleName="text-right middle" data-suffix=":">报名填写信息</label>
                        </div>
                        <div styleName="small-8 medium-8 columns">
                            <div styleName="row align-middle other">
                                <label styleName="small-3 columns"><input type="checkbox"/>是否参加过马拉松是</label>
                                <label styleName="small-3 columns"><input type="checkbox"/>是否参加过马拉松</label>
                                <label styleName="small-3 columns"><input type="checkbox"/>是否参加过马拉松</label>
                                <label styleName="small-3 columns"><input type="checkbox"/>是否参加过马拉松</label>
                                <label styleName="small-3 columns"><input type="checkbox"/>是否参加过马拉松</label>
                                <label styleName="small-3 columns"><input type="checkbox"/>是否参加过马拉松</label>
                                <label styleName="small-3 columns"><input type="checkbox"/>是否参加过马拉松</label>
                                <div styleName="input-group small-3 columns">
                                    <span styleName="input-group-label">
                                        <input type="checkbox"/>
                                    </span>
                                    <input styleName="input-group-field" type="text"/>
                                </div><div styleName="input-group small-3 columns">
                                    <span styleName="input-group-label">
                                        <input type="checkbox"/>
                                    </span>
                                    <input styleName="input-group-field" type="text"/>
                                </div><div styleName="input-group small-3 columns">
                                    <span styleName="input-group-label">
                                        <input type="checkbox"/>
                                    </span>
                                    <input styleName="input-group-field" type="text"/>
                                </div><div styleName="input-group small-3 columns">
                                    <span styleName="input-group-label">
                                        <input type="checkbox"/>
                                    </span>
                                    <input styleName="input-group-field" type="text"/>
                                </div><div styleName="input-group small-3 columns">
                                    <span styleName="input-group-label">
                                        <input type="checkbox"/>
                                    </span>
                                    <input styleName="input-group-field" type="text"/>
                                </div><div styleName="input-group small-3 columns">
                                    <span styleName="input-group-label">
                                        <input type="checkbox"/>
                                    </span>
                                    <input styleName="input-group-field" type="text"/>
                                </div><div styleName="input-group small-3 columns">
                                    <span styleName="input-group-label">
                                        <input type="checkbox"/>
                                    </span>
                                    <input styleName="input-group-field" type="text"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

// Api: https://facebook.github.io/react/docs/reusable-components.html
Create.propTypes = {
    actions: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};

export default connect(
    (state) => ({data: state.create}),
    (dispatch) => ({actions: bindActionCreators(createActions, dispatch)})
)(Create);
