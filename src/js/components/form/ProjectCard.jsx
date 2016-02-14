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
    componentWillMount() {
        let { project }=this.props;
        this.setState({
            project
        });
    }
    componentWillReceiveProps(nextProps) {
        let { project }= nextProps;
        this.setState({
            project
        });
    }
    addItem(){
        let project = [].slice.call(this.state.project);
        project.push({name:'',price:''});
        this.setState({
            project
        });
    }
    removeItem(index){
        let project = [].slice.call(this.state.project);
        project.splice(index,1);
        this.setState({
            project
        });
    }
    render() {
        let state = this.state;
        return (
            <ul styleName="small-8 medium-8 columns project-card">
                {state.project.map((elm,index) => (
                    <li styleName="callout" key={index}>
                        <h5>{ elm.name || <input type="text" placeholder='请输入名称'/> }</h5>
                        <p styleName="card-money">
                            <input type="number" styleName="text-right" defaultValue={ elm.price || 0 }/>
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
    project: PropTypes.array.isRequired,
    action: PropTypes.object.isRequired
};

export default ProjectCard;