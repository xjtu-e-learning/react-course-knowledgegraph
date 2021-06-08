import React from 'react';
import {
  Layout, Menu, Icon, Button,
} from 'antd/lib/index';

import { connect, Link } from 'umi';
import Nodechart from '../../components/nodechart';

const MenuItemGroup = Menu.ItemGroup;
const {
  Content, Sider,
} = Layout;

class Topicextract extends React.Component {

  startExtract = () => {
    const { currentSubjectAndDomain } = this.props.dashboard;
    const { extractState } = this.props.construct;
    const { dispatch } = this.props;
    if (currentSubjectAndDomain.length === 2 && extractState === 'start') {
      if(currentSubjectAndDomain[1].indexOf('数据结构')!== -1) // 这么写真是日了狗了
      {
        dispatch({
          type: 'construct/getGexfTopics',
          payload: {
            gexf: this.props.dashboard.kfdata
          }
        })
        return;
      }

      dispatch({
        type: 'construct/getTopics',
        payload: {
          domainName: currentSubjectAndDomain[1],
        },
      });
    }
  };

  next = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'construct/updateStep',
      payload: {
        step: 1,
      },
    });
  };

  render() {
    const { currentSubjectAndDomain, options } = this.props.dashboard;
    if (currentSubjectAndDomain.length !== 2 || options.length === 0) return null;
    const { topicList, extractState } = this.props.construct;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <span><b>学科：</b>{currentSubjectAndDomain[0]}</span>
          <span style={{ paddingLeft: '16px', paddingRight: 16 }}><b>课程：</b>{currentSubjectAndDomain[1]}</span>
          <Button type="primary" onClick={this.startExtract} disabled={extractState === 'finish'}>
            {extractState === 'start' && '开始抽取'}
            {extractState !== 'start' && (extractState === 'processing' ? '抽取中' : '抽取完成')}
            {extractState !== 'start' && (extractState === 'processing' ? <Icon type="loading"/> :
              <Icon type="check"/>)}
          </Button>
          {extractState === 'finish' &&
          <Link to='/construct/dependencemining'><Button style={{ marginLeft: 16 }} type={'primary'}
                                                         onClick={this.next}>下一步</Button></Link>}
        </div>

        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', maxHeight: '65vh', overflow: 'auto' }}
            >
              <MenuItemGroup key="topic" title="知识主题">
                {topicList.map((topic) => <Menu.Item key={topic.topicId}>{topic.topicName}</Menu.Item>)}
              </MenuItemGroup>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 600 }}>
            <Nodechart topicList={topicList}/>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(({ dashboard, construct }) => ({ dashboard, construct }))(Topicextract);
