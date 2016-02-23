/**
 * Created by jruif on 16/2/13.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import extend from 'lodash.assign';
import styles from '../../../css/modules/ProjectCard.scss';

@CSSModules(styles, {
    allowMultiple: true
})
class ProjectCard extends Component {
    constructor(props, context) {
        super(props, context);
        let { project }=this.props;
        this.state = { project };
    }
    componentWillReceiveProps(nextProps){
        let project = nextProps.project;
        this.setState({
            project
        });
    }
    addItem(){
        const { addItem } = this.props.actions;
        addItem('items',{name:'',price:0});
    }
    removeItem(index){
        const { removeItem } = this.props.actions;
        removeItem('items',index);
    }
    updateForm(index,event){
        event.stopPropagation();
        let target = event.target;
        let { updateForm } = this.props.actions;
        updateForm('items',{
            [target.name]:target.value
        },index);
    }
    changeValue(index,event){
        event.stopPropagation();
        let [target,project] = [event.target,this.state.project];
        this.setState({
            project:[
                ...project.slice(0,index),
                extend(project[index],{[target.name]:[target.value]}),
                ...project.slice(index+1)
            ]
        })
    }
    render() {
        let { project,type }=this.props;
        return (
            <ul styleName="small-8 medium-8 columns project-card">
                {this.state.project.map((elm,index) => (
                    <li styleName="callout" key={`${type}-${index}`}
                        onBlur={this.updateForm.bind(this,index)}
                        onChange={this.changeValue.bind(this,index)}>
                        <h5><input type="text" placeholder='请输入名称' name="name" value={ elm.name }/></h5>
                        <p styleName="card-money">
                            <input type="number" styleName="text-right" name="price" value={ elm.price || 0 }/>
                            <span>元</span>
                        </p>
                        <a styleName="close-button" onClick={this.removeItem.bind(this,index)}>
                            <span aria-hidden="true">&times;</span>
                        </a>
                    </li>
                ))}
                <li styleName="card-add">
                    <a styleName="button secondary" onClick={this.addItem.bind(this)}>+</a>
                </li>
            </ul>
        )
    }
}
ProjectCard.propTypes = {
    type: PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
    project: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

export default ProjectCard;