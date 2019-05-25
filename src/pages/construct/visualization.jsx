import React from 'react';
import {
  Layout, Menu, Icon, Button,
} from 'antd/lib/index';

import { connect } from 'dva/index';
import ConstructStep from '../../components/ConstructStep';
import Assemblechart from '../../components/assemblechart';

const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;
const {
   Content,  Sider,
} = Layout;

class Visualization extends React.Component {

  startExtract = () => {
    const { currentSubjectAndDomain } = this.props.dashboard;
    const { topicList } = this.props.construct;
    const { dispatch } = this.props;
    if(currentSubjectAndDomain.length === 2){
      dispatch({
        type: 'construct/getFacets',
        payload: {
          domainName: currentSubjectAndDomain[1],
          topicList
        }
      })
    }
  }

  startCrawl = () => {
    const { currentSubjectAndDomain } = this.props.dashboard;
    const { topicList, facetList } = this.props.construct;
    const { dispatch } = this.props;
    if(currentSubjectAndDomain.length === 2){
      dispatch({
        type: 'construct/getAssembles',
        payload: {
          domainName: currentSubjectAndDomain[1],
          topicList,
          facetList
        }
      })
    }
  }

  render() {
    const { currentSubjectAndDomain, options } = this.props.dashboard;
    if(currentSubjectAndDomain.length !== 2 || options.length === 0) return null;
    const { topicList, step, dependenceList, facetList, discoverState, assembleList } = this.props.construct;
    return (
      <div>
        <div style={{marginBottom: 16}}>
          <span><b>学科：</b>{currentSubjectAndDomain[0]}</span>
          <span style={{paddingLeft: '16px', paddingRight: 16}}><b>课程：</b>{currentSubjectAndDomain[1]}</span>
          <Button type="primary" onClick={this.startExtract}>
            {discoverState === 'start' && '开始属性挖掘&知识碎片集成'}
            {discoverState !== 'start' && (discoverState === 'processing' ? '挖掘中' : '挖掘完成')}
            {discoverState !== 'start' && (discoverState === 'processing' ? <Icon type="loading" /> : <Icon type="check" />)}
          </Button>
          {discoverState === 'finish' && <Button style={{marginLeft: 16}} type={"primary"} onClick={this.startCrawl}>采集知识碎片</Button>}
        </div>

        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Sider width={240} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', maxHeight: '65vh', overflow: 'auto' }}
            >
              <MenuItemGroup key="topic" title="知识主题及其属性">
                {topicList.map((topic) => {
                  if(facetList[topic.topicName] !== undefined){
                    return (
                      <SubMenu key={topic.topicId} title={topic.topicName}>
                        {facetList[topic.topicName].filter(facet => facet.facetName !== '匿名分面').map(facet => <Menu.Item key={facet.facetId}>{facet.facetName}</Menu.Item>)}
                      </SubMenu>
                    );
                  }
                  return <Menu.Item key={topic.topicId}>{topic.topicName}</Menu.Item>
                })}
              </MenuItemGroup>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 600 }}>
            {/*{miningState !== 'finish' ? <Nodechart topicList={topicList} /> : <Dependencechart topicList={topicList} dependenceList={dependenceList} />}*/}
            <Assemblechart topicList={topicList} dependenceList={dependenceList} assembleList={assembleList}/>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(({dashboard, construct}) => ({dashboard, construct}))(Visualization);
