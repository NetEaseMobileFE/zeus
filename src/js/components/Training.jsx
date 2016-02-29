/**
 * Created by jruif on 16/2/25.
 */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link,Router } from 'react-router';
import CSSModules from 'react-css-modules';
import extend from 'lodash.assign';
import styles from '../../css/modules/Training.scss';

import { routeActions } from 'react-router-redux';
import * as TrainingAction from '../actions/training';
import * as Ajax from '../actions/fetch';

@CSSModules(styles, {
    allowMultiple: true
}) class Training extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        let { ajax } = this.props.ajax;
        let { updateValue } = this.props.actions;
        let self = this;
        ajax({
            url:'/admin/category/listByPid',
            body:{
                pid:0
            }
        },function(rs){
            updateValue('topTitle',rs.data);
        }).then(()=>{
            ajax({
                url:'/admin/runningPlan/getRunningPlanBySecondCategoryId',
                body:{
                    id:1
                }
            },function(rs){
                updateValue('data',rs.data);
            })
        });
    }

    render() {
        let { data }=this.props;
        return (
            <div styleName="panel">
                <div className="row">
                    <div className="columns"><h4>跑步培训</h4></div>
                    <div className="shrink columns text-right"></div>
                </div>
                <ul styleName="tabs" data-tabs id="example-tabs">
                    {
                        data.topTitle.map((elm)=>(
                            <li className="tabs-title is-active">
                                <Link to={`training/${elm.id}`}>{elm.name}</Link>
                            </li>
                        ))
                    }
                </ul>
                <div styleName="tabs-content">
                    <div styleName="tabs-panel">
                        {
                            data.data.map((elm)=> Object.keys(elm).join('|') )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
Training.propTypes = {
    data: PropTypes.object,
    actions: PropTypes.object,
    route: PropTypes.object,
    router: PropTypes.object
};

export default connect(
    (state) => ({
        data: state.training,
        route: state.routeReducer
    }),
    (dispatch) => ({
        actions: bindActionCreators(TrainingAction, dispatch),
        router: bindActionCreators(routeActions, dispatch),
        ajax: bindActionCreators(Ajax, dispatch)
    })
)(Training);