/**
 * Created by jruif on 16/2/2.
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import { Router, Route, Link } from 'react-router';
import CSSModules from 'react-css-modules';
import moment from 'moment';
import extend from 'lodash.assign';
import * as AppListAction from '../actions/applist';
import * as Ajax from '../actions/fetch';
import styles from '../../css/modules/applist.scss';
import Pagination from './common/Pagination.jsx'

@CSSModules(styles, {
    allowMultiple: true
})
class AppList extends Component {
    constructor(props, context) {
        super(props, context);
        let { param,data } = this.props.applist;
        this.curState= [
            "","报名中","报名未开始",
            "名额已满","报名结束","未开赛",
            "已开赛","比赛结束","已报名-未支付",
            "报名成功-支付成功","取消报名","我关注的赛事"
        ];
        this.state={
            name:param.name,
            data:data.slice()
        };
    }
    componentDidMount(){
        this.init();
    }
    componentWillReceiveProps(nextProps){
        let applist = nextProps.applist;
        this.setState({
            data:applist.data.slice()
        });
    }
    updateValue(event){
        let target = event.target;
        const {updateParam} = this.props.actions;
        updateParam(target.name,target.value);
    }
    handlePageChangeClick(number){
        const {updateParam} = this.props.actions;
        updateParam('pageNum',number);
        this.init();
    }
    search(){
        if(this.state.name){
            let { updateParam,updateList } = this.props.actions;
            updateList(true,'is_search');
            updateParam('pageNum',1);
            this.init();
        }
    }
    init(){
        let self = this;
        let { ajax } = this.props.ajax;
        let { updateList } = this.props.actions;
        ajax({
            url:'/list',
            queryType:'applist'
        },function(result){
            updateList(result.data);
            self.setState({
                data:result.data.map((elm)=>extend({},elm,{is_editing:false}))
            });
        });

        ajax({
            url:'/totalCount',
            queryType:'applist'
        },function(result){
            updateList(result.data,'pagination');
        })
    }
    returnAll(){
        let { updateParam,updateList } = this.props.actions;
        updateParam('pageNum',1);
        updateParam('name','');
        updateList(false,'is_search');
        this.setState({
            name:''
        });
        this.init();
    }
    switchInput(index,event){
        let data = this.state.data;
        let parent = event.target.parentElement;
        this.setState({
            data:[
                ...data.slice(0,index),
                extend({},data[index],{is_editing:true}),
                ...data.slice(index+1)
            ]
        });
        setTimeout(()=>{
            let input = parent.children[0];
            input.focus()
        },100);
    }
    blurWeight(index,event){
        let [self, data, value] = [this, this.state.data, parseInt(event.target.value,10)];
        let {ajax} = this.props.ajax;
        let {updateData} = this.props.actions;
        ajax({
            url: '/update',
            method:'POST',
            queryType:'other',
            body:{
                id: data[index].id,
                weight: value
            }
        },function(){
            updateData(value,index);
            self.setState({
                data:[
                    ...data.slice(0,index),
                    extend({},data[index],{is_editing:false}),
                    ...data.slice(index+1)
                ]
            });
        });
    }
    changeWeight(index,event){
        event.stopPropagation();
        let data = this.state.data;
        this.setState({
            data:[
                ...data.slice(0,index),
                extend(data[index],{weight:event.target.value}),
                ...data.slice(index+1)
            ]
        });
    }

    render() {
        const { param,pagination,is_search } = this.props.applist;
        let [self,count] = [this,10];
        return (
            <div className="panel" styleName="applist">
                <div className="row" styleName="line">
                    <div className="columns"><h4>首页</h4></div>
                    <div className="columns">
                        <div className="input-group ">
                            <input className="input-group-field" type="text" name="name"
                                   value={this.state.name}
                                   onChange={(event)=>{this.setState({name:event.target.value})}}
                                   onBlur={this.updateValue.bind(this)}/>
                            <div className="input-group-button">
                                <input type="submit" className="button" value="搜 索"
                                       onClick={this.search.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className="shrink columns text-right">
                        <Link className="button alert" to="/create">创建活动</Link>
                    </div>
                </div>
                <div className="row" styleName="line">
                    <table>
                        <thead>
                            <tr>
                            {
                                ["","活动名称","比赛时间","权重","当前状态","报名数/总名额"].map((elm,index)=>(
                                    <th key={`title-${index}`}>{elm}</th>
                                ))
                            }
                            </tr>
                        </thead>
                        <tbody>
                        {
                            self.state.data.map((elm,index)=>(
                                <tr key={`content-${index}`}>
                                    <td>{(param.pageNum-1)*count+(index+1)}</td>
                                    <td><Link to={`/match/${elm.id}`}>{elm.name || '-'}</Link></td>
                                    <td>{moment(elm.gameStart).local('zh-cn').format('lll')}</td>
                                    <td width="80">
                                        {
                                            elm.is_editing ?
                                                <input type="number" value={elm.weight || '-'}
                                                       onChange={this.changeWeight.bind(this,index)}
                                                       onBlur={this.blurWeight.bind(this,index)}/> :
                                                <span  onClick={this.switchInput.bind(this,index)}>{elm.weight || '-'}</span>
                                        }
                                    </td>
                                    <td>{self.curState[elm.state] || '-'}</td>
                                    <td>{elm.signUpNum || "0"}/{elm.limitNum || "0"}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <Pagination total={Math.ceil(pagination / count)}
                                curPage={param.pageNum}
                                toPage={this.handlePageChangeClick.bind(this)} />
                    {
                        is_search && (
                            <div className="columns text-right">
                                <button onClick={this.returnAll.bind(this)}
                                        className="button alert tiny" styleName="return">返回全部</button>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

// Api: https://facebook.github.io/react/docs/reusable-components.html
AppList.propTypes = {
    applist: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    ajax: PropTypes.object.isRequired
};

export default connect(
    (state) => ({applist: state.applyList}),
    (dispatch) => ({
        actions: bindActionCreators(AppListAction, dispatch),
        route: bindActionCreators(routeActions, dispatch),
        ajax: bindActionCreators(Ajax, dispatch)
    })
)(AppList);
