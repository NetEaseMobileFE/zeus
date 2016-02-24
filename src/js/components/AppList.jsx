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
        this.curState= [
            "","报名中","报名未开始",
            "名额已满","报名结束","未开赛",
            "已开赛","比赛结束","已报名-未支付",
            "报名成功-支付成功","取消报名","我关注的赛事"
        ]
    }
    componentDidMount(){
        this.search();
    }
    updateValue(event){
        let target = event.target;
        const {updateParam} = this.props.actions;
        updateParam(target.name,target.value);
    }
    handlePageChangeClick(number){
        const {updateParam} = this.props.actions;
        updateParam('pageNum',number);
        this.search();
    }
    search(){
        let { ajax } = this.props.ajax;
        let { updateList } = this.props.actions;
        ajax({
            url:'/list',
            queryType:'applist'
        },function(result){
            updateList(result.data);
        });

        ajax({
            url:'/totalCount',
            queryType:'applist'
        },function(result){
            updateList(result.data,'pagination');
        })
    }
    render() {
        const { data,param,pagination } = this.props.applist;
        let [self,count] = [this,10];
        return (
            <div styleName="panel applist">
                <div styleName="row">
                    <div styleName="columns"><h4>首页</h4></div>
                    <div styleName="columns">
                        <div styleName="input-group ">
                            <input styleName="input-group-field" type="text" name="name"
                                   defaultValue={param.name}
                                   onBlur={this.updateValue.bind(this)}/>
                            <div styleName="input-group-button">
                                <input type="submit" styleName="button" value="搜 索"
                                       onClick={this.search.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div styleName="shrink columns text-right">
                        <Link styleName="button alert" to="/create">创建活动</Link>
                    </div>
                </div>
                <div styleName="row">
                    <table>
                        <thead>
                            <tr>
                            {
                                ["","活动名称","比赛时间","权重","当前状态","总名额/报名数"].map((elm,index)=>(
                                    <th key={`title-${index}`}>{elm}</th>
                                ))
                            }
                            </tr>
                        </thead>
                        <tbody>
                        {
                            data.map((elm,index)=>(
                                <tr key={`content-${index}`}>
                                    <td>{(param.pageNum-1)*count+(index+1)}</td>
                                    <td><Link to={`/match/${elm.id}`}>{elm.name || '-'}</Link></td>
                                    <td>{moment(elm.gameStart).local('zh-cn').format('lll')}</td>
                                    <td>{elm.weight || '-'}</td>
                                    <td>{self.curState[elm.state] || '-'}</td>
                                    <td>{elm.signUpNum || "0"}/{elm.limitNum || "0"}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <Pagination total={Math.ceil(pagination / count)}
                                curPage={param.pageNum}
                                toPage={this.handlePageChangeClick.bind(this)} />
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
