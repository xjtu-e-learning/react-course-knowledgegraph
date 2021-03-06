import React from 'react';
import {
  Layout, Menu, Icon, Button,
} from 'antd/lib/index';

import { connect, Link } from 'umi';
import Nodechart from '../../components/nodechart';
import ConstructStep from '../../components/ConstructStep';
import Dependencechart from '../../components/dependencechart';

const MenuItemGroup = Menu.ItemGroup;
const {
  Content, Sider,
} = Layout;

class Dependencemining extends React.Component {

  startExtract = () => {
    const { currentSubjectAndDomain } = this.props.dashboard;
    const { dispatch } = this.props;
    const {miningState} = this.props.construct;
    if(currentSubjectAndDomain.length === 2 && miningState === 'start'){
      if(currentSubjectAndDomain[1].indexOf('数据结构')!== -1) // 这么写真是日了狗了
      {
        dispatch({
          type: 'construct/getGexfDependencies',
          payload: {
            gexf: this.props.dashboard.kfdata
          }
        })
        return;
      }
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
    const { currentSubjectAndDomain, options, kfdata, subjectkfdata } = this.props.dashboard;
    if(currentSubjectAndDomain.length !== 2 || options.length === 0) return null;
    const { topicList, miningState, dependenceList, step } = this.props.construct;

    return (
      <div>
        <div style={{marginBottom: 16}}>
          <span><b>学科：</b>{currentSubjectAndDomain[0]}</span>
          <span style={{paddingLeft: '16px', paddingRight: 16}}><b>课程：</b>{currentSubjectAndDomain[1]}</span>
          <Button type="primary" onClick={this.startExtract} disabled={miningState === 'finish'}>
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
            {/*{miningState !== 'finish' ? <Nodechart topicList={topicList} /> : <Dependencechart topicList={topicList} dependenceList={dependenceList} />}*/}
            <Dependencechart topicList={topicList} dependenceList={dependenceList} kfdata={kfdata} />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(({dashboard, construct}) => ({dashboard, construct}))(Dependencemining);
