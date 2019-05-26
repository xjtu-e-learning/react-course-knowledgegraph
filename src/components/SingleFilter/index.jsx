import React from 'react';
import { Radio } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class SingleFilter extends React.Component {
  render() {
    const { filterTopic, content } = this.props;
    let topics = [];
    for(let key in content){
      topics.push([key, content[key]]);
    }
    return (
      <div>
        <h4>
          {filterTopic}
        </h4>
        <RadioGroup onChange={this.props.onChange} defaultValue={'全部'}>
          <RadioButton value={'全部'}>全部</RadioButton>
          {topics.map(element =>
            <RadioButton value={element[0]}>{element[0] + element[1]}</RadioButton>)}
        </RadioGroup>
      </div>
    );
  }
}

export default SingleFilter;
