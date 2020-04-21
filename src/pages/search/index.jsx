import React from 'react';
import { Icon, Input } from 'antd';
import { Layout, Menu, Breadcrumb, Pagination } from 'antd';
import { connect } from 'umi';
import SingleFilter from '../../components/SingleFilter';
import SingleAssemble from '../../components/SingleAssemble';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;

class ESearch extends React.Component {

  constructor(props) {
    super(props);
    this.filterTopicsMap = {
      'facet_name_agg': '按属性',
      'subject_name_agg': '按学科',
      'assemble_type_agg': '按碎片类型',
      'topic_name_agg': '按知识主题',
      'domain_name_agg': '按课程',
      'assemble_source_agg': '按知识源',
    };
    this.filterTopics = ['subject_name_agg', 'domain_name_agg', 'topic_name_agg',
      'facet_name_agg', 'assemble_source_agg', 'assemble_type_agg'];
  }

  searchFunction = (value) => {
    // console.log(value);
    if (value === '') return;
    const { dispatch } = this.props;
    const {
      querySize,
    } = this.props.dashboard;
    dispatch({
      type: 'dashboard/getQuery',
      payload: {
        queryString: value,
        querySubjectName:'',
        queryDomainName:'',
        queryTopicName:'',
        queryFacetName:'',
        queryFacetLayer:'',
        queryAssembleSource:'',
        queryAssembleType:'',
        queryPage:0,
        querySize,
      },
    });

  };

  onPageChange = (page, pageSize) => {
    const { dispatch } = this.props;
    const {
      queryString,
      querySubjectName,
      queryDomainName,
      queryTopicName,
      queryFacetName,
      queryFacetLayer,
      queryAssembleSource,
      queryAssembleType,
    } = this.props.dashboard;

    dispatch({
      type: 'dashboard/getQuery',
      payload: {
        queryString: queryString,
        querySubjectName,
        queryDomainName,
        queryTopicName,
        queryFacetName,
        queryFacetLayer,
        queryAssembleSource,
        queryAssembleType,
        queryPage: page-1,
        pageSize,
      },
    });

  };

  onFilterChange = (filterType, e) => {
    let selectedItem = (e.target.value === '全部')?'':e.target.value;
    const { dispatch } = this.props;
    const {
      queryString,
      querySubjectName,
      queryDomainName,
      queryTopicName,
      queryFacetName,
      queryFacetLayer,
      queryAssembleSource,
      queryAssembleType,
      querySize,
    } = this.props.dashboard;

    switch (filterType) {
      case '按学科':
        dispatch({
          type: 'dashboard/getQuery',
          payload: {
            queryString: queryString,
            querySubjectName: selectedItem,
            queryDomainName,
            queryTopicName,
            queryFacetName,
            queryFacetLayer,
            queryAssembleSource,
            queryAssembleType,
            queryPage: 0,
            querySize:querySize,
          },
        });
        break;
      case '按课程':
        dispatch({
          type: 'dashboard/getQuery',
          payload: {
            queryString: queryString,
            querySubjectName,
            queryDomainName: selectedItem,
            queryTopicName,
            queryFacetName,
            queryFacetLayer,
            queryAssembleSource,
            queryAssembleType,
            queryPage: 0,
            querySize:querySize,
          },
        });
        break;
      case '按知识主题':
        dispatch({
          type: 'dashboard/getQuery',
          payload: {
            queryString: queryString,
            querySubjectName,
            queryDomainName,
            queryTopicName: selectedItem,
            queryFacetName,
            queryFacetLayer,
            queryAssembleSource,
            queryAssembleType,
            queryPage: 0,
            querySize:querySize,
          },
        });
        break;
      case '按属性':
        dispatch({
          type: 'dashboard/getQuery',
          payload: {
            queryString: queryString,
            querySubjectName,
            queryDomainName,
            queryTopicName,
            queryFacetName: selectedItem,
            queryFacetLayer,
            queryAssembleSource,
            queryAssembleType,
            queryPage: 0,
            querySize:querySize,
          },
        });
        break;
      case '按知识源':
        dispatch({
          type: 'dashboard/getQuery',
          payload: {
            queryString: queryString,
            querySubjectName,
            queryDomainName,
            queryTopicName,
            queryFacetName,
            queryFacetLayer,
            queryAssembleSource: selectedItem,
            queryAssembleType,
            queryPage: 0,
            querySize:querySize,
          },
        });
        break;
      case '按碎片类型':
        dispatch({
          type: 'dashboard/getQuery',
          payload: {
            queryString: queryString,
            querySubjectName,
            queryDomainName,
            queryTopicName,
            queryFacetName,
            queryFacetLayer,
            queryAssembleSource,
            queryAssembleType: selectedItem,
            queryPage: 0,
            querySize:querySize,
          },
        });
        break;

    }

  };


  render() {
    const { queryPage, queryString, queryCount, querySize, queryUseTime, queryFilterResult, queryAssembleResult } = this.props.dashboard;
    let filters = [];
    for (let key of this.filterTopics) {
      filters.push([this.filterTopicsMap[key], queryFilterResult[key]]);
    }
    return (
      <div>
        <div style={{ width: 400, margin: 'auto', marginTop: 24, marginBottom: 24 }}>
          <Search defaultValue={queryString} size={'large'} onSearch={this.searchFunction} enterButton/>
          {queryCount !== 0 && <h4 style={{ textAlign: 'left' }}>{`找到如下 ${queryCount} 条相关内容，耗时 ${queryUseTime} `}</h4>}
        </div>
        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Sider width={240} style={{ background: '#fff' }}>
            {queryString !== '' && filters.map(element => <SingleFilter filterTopic={element[0]}
                                                                        content={element[1]} onFilterChange={this.onFilterChange.bind(this, element[0])}/>)}
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {queryAssembleResult.map(element =>
                <SingleAssemble hitAssemble={element} searchpage={true}/>,
              // console.log(element)
            )}
            {queryCount !== 0 &&
            <Pagination current={queryPage + 1} total={(queryCount<20000)?queryCount:20000} pageSize={querySize} onChange={this.onPageChange}/>}
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(({ dashboard }) => ({ dashboard }))(ESearch);
