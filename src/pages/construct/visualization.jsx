import React from 'react';
import {
  Layout, Menu, Icon, Button,
} from 'antd/lib/index';

import { connect } from 'umi';
import ConstructStep from '../../components/ConstructStep';
import Assemblechart from '../../components/assemblechart';

const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;
const {
  Content, Sider,
} = Layout;

class Visualization extends React.Component {

  startExtract = () => {
    const { currentSubjectAndDomain } = this.props.dashboard;
    const { topicList, discoverState } = this.props.construct;
    const { dispatch } = this.props;
    if (discoverState !== 'start') {
      return;
    }
    if (currentSubjectAndDomain.length === 2) {
      dispatch({
        type: 'construct/getFacets',
        payload: {
          domainName: currentSubjectAndDomain[1],
          topicList,
        },
      });
    }
  };

  navigateToGenerate = () => {
    const { currentSubjectAndDomain } = this.props.dashboard;
    let currentDomain = currentSubjectAndDomain[1] || '';
    if(currentDomain.indexOf('数据结构') !== -1){
      currentDomain = '数据结构';
    }
    window.open(`http://8.136.8.221/index.html#/show/generate?courseName=${currentDomain}-generate&type=0`);
  }

  navigateToFusion = () => {
    const { currentSubjectAndDomain } = this.props.dashboard;
    let currentDomain = currentSubjectAndDomain[1] || '';
    if(currentDomain.indexOf('数据结构') !== -1){
      currentDomain = '数据结构';
    }
    window.open(`http://8.136.8.221/index.html#/show/fusion?courseName=${currentDomain}-fusion&type=1`)
  }

  render() {
    const { currentSubjectAndDomain, options, kfdata } = this.props.dashboard;
    if (currentSubjectAndDomain.length !== 2 || options.length === 0) return null;
    const { topicList, step, dependenceList, facetList, discoverState, assembleList } = this.props.construct;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <span><b>学科：</b>{currentSubjectAndDomain[0]}</span>
          <span style={{ paddingLeft: '16px', paddingRight: 16 }}><b>课程：</b>{currentSubjectAndDomain[1]}</span>
          <Button type="primary" onClick={this.startExtract} disabled={discoverState === 'finish'}>
            {discoverState === 'start' && '开始属性挖掘&知识单元集成'}
            {discoverState !== 'start' && (discoverState === 'processing' ? '挖掘中' : '挖掘完成')}
            {discoverState !== 'start' && (discoverState === 'processing' ? <Icon type="loading" /> :
              <Icon type="check" />)}
          </Button>
          {
            discoverState === 'finish' && (
              <>
                <Button type='primary' style={{ marginLeft: '16px'}} onClick={this.navigateToGenerate}>生成阶段质量评价</Button>
                <Button type='primary' style={{ marginLeft: '16px' }} onClick={this.navigateToFusion}>融合阶段质量评价</Button>
              </>
            )
          }
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
                  if (facetList[topic.topicName] !== undefined) {
                    return (
                      <SubMenu key={topic.topicId} title={topic.topicName}>
                        {facetList[topic.topicName].filter(facet => facet.facetName !== '匿名分面').map(facet => <Menu.Item
                          key={facet.facetId}>{facet.facetName}</Menu.Item>)}
                      </SubMenu>
                    );
                  }
                  return <Menu.Item key={topic.topicId}>{topic.topicName}</Menu.Item>;
                })}
              </MenuItemGroup>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 600 }}>
            {/*{miningState !== 'finish' ? <Nodechart topicList={topicList} /> : <Dependencechart topicList={topicList} dependenceList={dependenceList} />}*/}
            <Assemblechart topicList={topicList} dependenceList={dependenceList} assembleList={assembleList} domainName={currentSubjectAndDomain[1]}
              kfdata={kfdata} />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(({ dashboard, construct }) => ({ dashboard, construct }))(Visualization);
