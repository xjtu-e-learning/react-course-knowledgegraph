import React from 'react';
import {
  Layout, Menu, Icon, Button,
} from 'antd/lib/index';

import { connect } from 'dva/index';
import Nodechart from '../../components/nodechart';
import ConstructStep from '../../components/ConstructStep';
import Dependencechart from '../../components/dependencechart';
import Link from 'umi/link';

const MenuItemGroup = Menu.ItemGroup;
const {
  Content, Sider,
} = Layout;

class Dependencemining extends React.Component {

  startExtract = () => {
    const { currentSubjectAndDomain } = this.props.dashboard;
    const { dispatch } = this.props;
    if(currentSubjectAndDomain.length === 2){
      dispatch({
        type: 'construct/getDependences',
        payload: {
          domainName: currentSubjectAndDomain[1],
        }
      })
    }
  }

  next = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'construct/updateStep',
      payload: {
        step: 2
      }
    });
  }

  render() {
    const { currentSubjectAndDomain, options } = this.props.dashboard;
    if(currentSubjectAndDomain.length !== 2 || options.length === 0) return null;
    const { topicList, miningState, dependenceList, step } = this.props.construct;
    return (
      <div>
        <div style={{marginBottom: 16}}>
          <span><b>学科：</b>{currentSubjectAndDomain[0]}</span>
          <span style={{paddingLeft: '16px', paddingRight: 16}}><b>课程：</b>{currentSubjectAndDomain[1]}</span>
          <Button type="primary" onClick={this.startExtract}>
            {miningState === 'start' && '开始挖掘'}
            {miningState !== 'start' && (miningState === 'processing' ? '挖掘中' : '挖掘完成')}
            {miningState !== 'start' && (miningState === 'processing' ? <Icon type="loading" /> : <Icon type="check" />)}
          </Button>
          {miningState === 'finish' && <Link to='/construct/visualization'><Button style={{marginLeft: 16}} type={"primary"} onClick={this.next}>下一步</Button></Link>}
        </div>

        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Sider width={240} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', maxHeight: '65vh', overflow: 'auto' }}
            >
              <MenuItemGroup key="topic" title="认知关系">
                {dependenceList.map((dependence) => <Menu.Item key={dependence.id}>{`${dependence.source} -> ${dependence.target}`}</Menu.Item>)}
              </MenuItemGroup>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 600 }}>
            {miningState !== 'finish' ? <Nodechart topicList={topicList} /> : <Dependencechart topicList={topicList} dependenceList={dependenceList} />}

          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(({dashboard, construct}) => ({dashboard, construct}))(Dependencemining);
