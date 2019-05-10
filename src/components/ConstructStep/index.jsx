import React from 'react';
import { Steps } from 'antd';
import styles from './steps.css';

const Step = Steps.Step;

const steps = [{
  title: '知识主题抽取',
  content: '知识主题抽取',
}, {
  title: '认知关系挖掘',
  content: '认知关系挖掘',
}, {
  title: '可视化',
  content: '可视化',
}];

class ConstructStep extends React.Component {


  render() {
    const { current } = this.props;
    return (
      <div style={{marginTop: '24px', marginBottom: '24px'}}>
        <Steps current={current} className={styles.steps}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
      </div>
    );
  }
}

export default ConstructStep;
