import React from 'react';
import styles from './index.css';
import { Layout, Menu } from 'antd';
import Link from 'umi/link';
import SearchInput from '../components/SearchInput';
import './index.css';
import { connect } from 'dva';
import router from 'umi/router';

const { Header, Content, Footer } = Layout;


class BasicLayout extends React.Component{

  searchFunction = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/updateQueryString',
      payload: {
        queryString: value,
      }
    });
    const { queryString,
      querySubjectName,
      queryDomainName,
      queryTopicName,
      queryFacetName,
      queryFacetLayer,
      queryAssembleSource,
      queryAssembleType,
      queryPage,
      querySize
    } = this.props.dashboard;
    dispatch({
      type: 'dashboard/getQuery',
      payload: {
        queryString,
        querySubjectName,
        queryDomainName,
        queryTopicName,
        queryFacetName,
        queryFacetLayer,
        queryAssembleSource,
        queryAssembleType,
        queryPage,
        querySize
      }
    });
    router.push('/search');
  };

  render() {
    const props = this.props;
    return (
      <Layout className={styles.layout}>
        <Header style={{position: 'fixed', zIndex: 1100, width: '100%'}}>
          <div className={styles.logo} />
          <Menu
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={props.location.pathname === '/' ? ['1'] : ['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">
              <Link to="/">
                首页
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/construct/topicextract">
                构建
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/search">
                搜索
              </Link>
            </Menu.Item>
            {
              props.location.pathname !== '/search' &&
              <div className={styles.search}>
                <SearchInput searchFunction={this.searchFunction} />
              </div>
            }
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          {props.children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Copyright © 2019 大数据算法与分析技术国家工程实验室. All rights reserved.
        </Footer>
      </Layout>
    );
  }


};

export default connect(({dashboard}) => ({dashboard}))(BasicLayout);
