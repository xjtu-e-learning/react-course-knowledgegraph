import React from 'react';
import styles from './construct.css';
import ConstructStep from '../../components/ConstructStep';
import { connect } from 'dva/index';
import Topicextract from './topicextract';
import { Modal } from 'antd';
import Link from 'umi/link';



class Construct extends React.Component {

  render() {
    const { currentSubjectAndDomain, options } = this.props.dashboard;
    if(currentSubjectAndDomain.length !== 2 || options.length === 0) {
      return (
        <div>
          <Modal visible={true} footer={null} closable={false}>
            请前往<Link to='./'>首页</Link>选择学科和课程～
          </Modal>
        </div>
      );
    }
    const { step } = this.props.construct;
    return (
      <div className={styles.normal}>
        <ConstructStep current={step} />
        <Topicextract />
      </div>
    );
  }
}

export default connect(({dashboard, construct}) => ({dashboard, construct}))(Construct);
