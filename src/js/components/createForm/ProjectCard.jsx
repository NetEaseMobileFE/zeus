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
            [target.name]: target.name==='price'? parseInt(target.value, 10): target.value
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
        let { isModification,type }=this.props;
        return (
            <ul className="small-8 medium-8 columns" styleName="project-card">
                {this.state.project.map((elm,index) => (
                    <li className="callout" key={`${type}-${index}`}
                        onBlur={this.updateForm.bind(this,index)}>
                        <h5> {
                            isModification ? elm.name :
                                (<input type="text" placeholder='请输入名称' name="name" value={ elm.name }
                                                                onChange={this.changeValue.bind(this,index)}/>)
                        }</h5>
                        <p styleName="card-money">
                            {
                                isModification ? elm.price :
                                    (<input type="number" className="text-right" name="price" min="0"
                                            value={ parseInt(elm.price, 10) || 0 }
                                            onChange={this.changeValue.bind(this,index)}/>)
                            }
                            <span>元</span>
                        </p>
                        {
                            !isModification && (
                                <a className="close-button" onClick={this.removeItem.bind(this,index)}>
                                    <span aria-hidden="true">&times;</span>
                                </a>
                            )
                        }
                    </li>
                ))}
                {
                    !isModification && (
                        <li styleName="card-add">
                            <a className="button secondary" onClick={this.addItem.bind(this)}>+</a>
                        </li>
                    )
                }
            </ul>
        )
    }
}
ProjectCard.propTypes = {
    type: PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
    project: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    isModification: PropTypes.bool
};

export default ProjectCard;