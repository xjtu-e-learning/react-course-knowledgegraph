import React from 'react';
import styles from './index.css';
import { Layout, Menu } from 'antd';
import Link from 'umi/link';

const { Header, Content, Footer } = Layout;
class BasicLayout extends React.Component{

  render() {
    const props = this.props;
    return (
      <Layout className={styles.layout}>
        <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}>
          <div className={styles.logo} />
          <Menu
            theme="dark"
            mode="horizontal"
            // defaultSelectedKeys={props.location.pathname === '/' ? ['1'] : ['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">
              <Link to="./">
                首页
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="./construct">
                构建
              </Link>
            </Menu.Item>
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

export default BasicLayout;
