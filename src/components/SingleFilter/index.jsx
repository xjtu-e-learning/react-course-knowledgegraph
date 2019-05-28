import React from 'react';
import { Radio } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class SingleFilter extends React.Component {


  render() {
    const { filterTopic, content } = this.props;
    let topics = [];
    for(let i in content){
      // console.log(content);
      for(let key in content[i]){
        topics.push([key, content[i][key]]);
      }
    }
    // console.log(content)
    return (
      <div>
        <h4>
          {filterTopic}
        </h4>
        <RadioGroup onChange={this.props.onFilterChange} defaultValue={'全部'}>
          <RadioButton value={'全部'}>全部</RadioButton>
          {topics.map(element =>
            <RadioButton value={element[0]}>{element[0] + ' (' +  element[1] + ')'}</RadioButton>)}
        </RadioGroup>
      </div>
    );
  }
}

export default SingleFilter;
