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

  constructor(props){
    super(props);
    this.state = {defaultSelectedKeys: ['1']};
  }

  componentWillMount(){
    if(this.props.location.pathname === '/'){
      this.setState({defaultSelectedKeys: ['1']});
    }else if(this.props.location.pathname.match(/search/)){
      this.setState({defaultSelectedKeys: ['3']});
    }else if(this.props.location.pathname.match(/construct/)){
      this.setState({defaultSelectedKeys: ['2']});
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname === '/'){
      this.setState({defaultSelectedKeys: ['1']});
    }else if(nextProps.location.pathname.match(/search/)){
      this.setState({defaultSelectedKeys: ['3']});
    }else if(nextProps.location.pathname.match(/construct/)){
      this.setState({defaultSelectedKeys: ['2']});
    }
  }

  searchFunction = (value) => {
    if(value === '') return;
    const { dispatch } = this.props;
    const {
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
        queryString: value,
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
            selectedKeys={this.state.defaultSelectedKeys}
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
