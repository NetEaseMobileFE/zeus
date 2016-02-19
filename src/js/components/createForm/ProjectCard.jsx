/**
 * Created by jruif on 16/2/13.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/ProjectCard.scss';

@CSSModules(styles, {
    allowMultiple: true
})
class ProjectCard extends Component {
    constructor(props, context) {
        super(props, context);
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
    render() {
        let { project, type }=this.props;
        return (
            <ul styleName="small-8 medium-8 columns project-card">
                {project.map((elm,index) => (
                    <li styleName="callout" key={`${type}-${index}`} onBlur={this.updateForm.bind(this,index)}>
                        <h5><input type="text" placeholder='请输入名称' name="name" defaultValue={ elm.name }/></h5>
                        <p styleName="card-money">
                            <input type="number" styleName="text-right" name="price" defaultValue={ elm.price || 0 }/>
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
    type: PropTypes.string.isRequired,
    project: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

export default ProjectCard;