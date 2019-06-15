import { Cascader } from 'antd';
import React from 'react';
import styles from './multiselect.css';

class Multiselect extends React.Component{

  constructor(props) {
    super(props);
    this.state = {selected : []};
  }

  updateState = () => {
    const{currentSubjectAndDomain, options} = this.props;
    let children = [];
    for (let subjectId = 0; subjectId < options.length; ++subjectId){
      if(options[subjectId].label === currentSubjectAndDomain[0]){
        this.setState({selected:[options[subjectId].value]})
        children = options[subjectId].children
        break;
      }
    }

    if (currentSubjectAndDomain.length === 2){
      for (let courseId = 0; courseId < children.length; ++courseId){
        if (children[courseId].label === currentSubjectAndDomain[1]) {
          this.setState({ selected: [this.state.selected[0], children[courseId].value] })
          break
        }
      }
    }

  };

  componentDidMount() {
    const {defaultSelect} = this.props;
    this.setState({selected: [defaultSelect]})
  }

  render(){
    const { options, defaultSelect } = this.props;
    if(defaultSelect.length === 0) return null;
    return (
      <div className={styles.multiselect}>
        <label>学科/课程：</label>
        <Cascader value={this.state.selected} className={styles.selectinput} options={options} defaultValue={defaultSelect} onChange={this.props.onChange} changeOnSelect />
      </div>
    );
  }
}

export default Multiselect;
