/**
 * Created by jruif on 16/2/29.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/ContentItem.scss';
import extend from 'lodash.assign';

@CSSModules(styles, {
    allowMultiple: true
})
class ContentItem extends Component {
    constructor(props, context) {
        super(props, context);
        let { content }=this.props;
        this.state = extend({},content);
    }
    updateVale(event){
        let target = event.target;
        this.setState({
            [target.name]:target.value
        });
    }
    saveItem(){
        let self = this;
        let { index,ajax } = this.props;
        let { updateItem } = this.props.actions;
        let params = {
            id:self.state.id,
            title:self.state.title,
            content:self.state.content
        };
        ajax({
            url:'/admin/runningPlan/update',
            method:'POST',
            queryType:'application-www',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        },function(){
            updateItem('content', params ,index);
            self.editHandle(false);
        });
    }
    editItem(){
        this.editHandle(true);
    }
    cancelHandle(){
        this.editHandle(false);
    }
    editHandle(value){
        let { index } = this.props;
        let { updateItem } = this.props.actions;
        updateItem('content',{
            is_editing:!!value
        },index);
    }
    render() {
        let state = this.state;
        let { content }=this.props;
        return (
            <div className="row">
                <div className="column" onChange={this.updateVale.bind(this)}>
                    <h5>{state.days} : {
                        content.is_editing ?
                            (<input type="text" name="title" defaultValue={state.title}/>) :
                            state.title
                    }</h5>
                    <p>{content.is_editing ?
                        (<textarea type="text" name="content" defaultValue={state.content} rows="5"/>) :
                        state.content
                    }</p>
                </div>
                <div className="column small-3 align-middle">
                    {
                        ! content.is_editing ?
                            ( <button className="button tiny" onClick={this.editItem.bind(this)}>编 辑</button> ) :
                            ( <div>
                                <button className="button tiny" onClick={this.saveItem.bind(this)}>保 存</button>
                                <button className="button tiny alert" onClick={this.cancelHandle.bind(this)}>取 消</button>
                            </div> )
                    }
                </div>
            </div>
        )
    }
}
ContentItem.propTypes = {
    content: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

export default ContentItem;