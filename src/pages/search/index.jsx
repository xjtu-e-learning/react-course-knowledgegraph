import React from 'react';
import { Icon, Input } from 'antd';
import { Layout, Menu, Breadcrumb } from 'antd';
import { connect } from 'dva';
import SingleFilter from '../../components/SingleFilter';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
class ESearch extends React.Component {
  render() {
    const { queryString, queryCount, queryUseTime, queryFilterResult } = this.props.dashboard;
    let filters = [];
    for(let key in queryFilterResult){
      filters.push([key, queryFilterResult[key]]);
    }
    return(
      <div>
        <div style={{width: 400, margin: 'auto', marginTop: 24, marginBottom: 24}}>
          <Input defaultValue={queryString} size={'large'} addonAfter={<Icon type={'search'}/>}/>
          <h4 style={{textAlign: 'left'}}>{`找到如下 ${queryCount} 相关内容，耗时 ${queryUseTime} `}</h4>
        </div>
        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Sider width={240} style={{ background: '#fff' }}>
            {filters.map(element => <SingleFilter filterTopic={element[0]} content={element[1]}/>)}
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
        </Layout>
      </div>
    );
  }
}

export default connect(({dashboard}) => ({dashboard}))(ESearch);
