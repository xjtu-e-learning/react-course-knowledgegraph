import { Cascader } from 'antd';
import React from 'react';
import styles from './multiselect.css';

class Multiselect extends React.Component{


  render(){
    const { options, defaultSelect } = this.props;
    if(defaultSelect.length === 0) return null;
    return (
      <div className={styles.multiselect}>
        <label>学科/课程：</label>
        <Cascader className={styles.selectinput} options={options} defaultValue={defaultSelect} onChange={this.props.onChange} changeOnSelect />
      </div>
    );
  }
}

export default Multiselect;
