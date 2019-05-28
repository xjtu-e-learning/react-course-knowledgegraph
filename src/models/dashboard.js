import axios from 'axios';

export default {
  namespace: 'dashboard',
  state: {
    figurecard: [
      {
        icon: 'database',
        title: '学科',
        number: 0,
        color: 'green',
      }, {
        icon: 'book',
        title: '课程',
        number: 0,
        color: 'pink',
      }, {
        icon: 'read',
        title: '知识主题',
        number: 0,
        color: 'blue',
      }, {
        icon: 'profile',
        title: '知识单元',
        number: 0,
        color: 'yellow',
      }
    ],
    options: [],
    kfdata: '',
    defaultSelect: [],
    currentSubjectAndDomain: [],
    assembleCountGroupByTopicId: [],
    assembleCountGroupByDomainId: [],
    firstLayerFacetCountGroupByTopicId: [],
    topicCountGroupByDomainId: [],
    queryString: '',
    querySubjectName: '',
    queryDomainName: '',
    queryTopicName: '',
    queryFacetName: '',
    queryFacetLayer: '',
    queryAssembleSource: '',
    queryAssembleType: '',
    queryPage: 0,
    querySize: 10,
    queryAssembleResult: [],
    queryFilterResult: {},
    queryCount: 0,
    queryUseTime: '0ms',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
    }
  },
  effects: {
    *getSubject(action, { put, call }){
      const [result, result1, result2] = yield [
        call(axios, {
          method: 'get',
          url: 'http://yotta.xjtushilei.com:8083/domain/getDomainsGroupBySubject'
        }),
        call(axios, {
          method: 'get',
          url: 'http://yotta.xjtushilei.com:8083/statistics/countTopic'
        }),
        call(axios, {
          method: 'get',
          url: 'http://yotta.xjtushilei.com:8083/statistics/countAssemble'
        })];
      const tmp = result.data.data;
      const subjectCount = tmp.length;
      let domainCount = 0;
      let options = [];
      for(let subject of tmp){
        let temp = {};
        temp.value = subject.subjectId;
        temp.label = subject.subjectName;
        temp.children = [];
        for(let domain of subject.domains){
          let t = {};
          t.value = domain.domainId;
          t.label = domain.domainName;
          temp.children.push(t);
        }
        options.push(temp);
        domainCount += subject.domains.length;
      }

      yield put({
        type: 'add',
        payload: {
          subjectCount,
          domainCount,
          topicCount: result1.data.data,
          assembleCount: result2.data.data
        }
      });

      yield put({
        type: 'updateSelect',
        payload: {
          options
        }
      });

      yield put({
        type: 'updateDefaultSelect',
        payload: {
          defaultSelect: [options[0].value, options[0].children[0].value]
        }
      });

      yield put({
        type: 'updateCurrentSubjectAndDomain',
        payload: {
          currentSubjectAndDomain: [options[0].value, options[0].children[0].value]
        }
      });

      yield put({
        type: 'getFirstLayerFacetGroupByTopicIds',
        payload: {
          domainId: options[0].children[0].value
        }
      });
      yield put({
        type: 'getAssembleCountByTopicId',
        payload: {
          domainId: options[0].children[0].value
        }
      });
      yield put({
        type: 'getGexf',
        payload: {
          domainName: options[0].children[0].label
        }
      });
    },
    *getGexf(action, {put, call }){
      const result = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/dependency/getDependenciesByDomainNameSaveAsGexf?domainName=' + action.payload.domainName,
        method: 'post'
      });
      yield put({
        type: 'updateGexf',
        payload: {
          kfdata: result.data.data
        }
      })
    },
    *getAssembleCountByTopicId(action, { put, call }){
      const result = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/topic/getTopicsByDomainId?domainId=' + action.payload.domainId,
        method: 'get'
      });
      let topicList = result.data.data;
      let query = '';
      for(let topic of topicList){
        query += 'topicIds=' + topic.topicId + '&';
      }
      const result1 = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/statistics/countAssembleGroupByTopicIds?' + query,
        method: 'get'
      });
      let assembleCount = result1.data.data;
      let tmpList = [];
      for(let topic of topicList){
        let tmp = {};
        tmp.name = topic.topicName;
        tmp['知识单元'] = assembleCount[topic.topicId];
        tmpList.push(tmp);
      }
      yield put({
        type: 'updateAssembleCountGroupByTopicId',
        payload: {
          assembleCountGroupByTopicId: tmpList
        }
      })
    },
    *getFirstLayerFacetGroupByTopicIds(action, { put, call }){
      const result = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/topic/getTopicsByDomainId?domainId=' + action.payload.domainId,
        method: 'get'
      });
      let topicList = result.data.data;
      let query = '';
      for(let topic of topicList){
        query += 'topicIds=' + topic.topicId + '&';
      }
      const result1 = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/statistics/countFirstLayerFacetGroupByTopicIds?' + query,
        method: 'get'
      });
      let firstLayerCount = result1.data.data;
      let tmpList = [];
      for(let topic of topicList){
        let tmp = {};
        tmp.name = topic.topicName;
        tmp['属性'] = firstLayerCount[topic.topicId];
        tmpList.push(tmp);
      }
      yield put({
        type: 'updateFirstLayerFacetCountGroupByTopicId',
        payload: {
          firstLayerFacetCountGroupByTopicId: tmpList
        }
      })
    },
    *getTopicCountGroupByDomainId(action, { put, call }){
      const domains = action.payload.domains;
      let query = '';
      for(let domain of domains){
        query += 'domainIds=' + domain.value + '&';
      }
      const result = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/statistics/countTopicGroupByDomainIds?' + query,
        method: 'get'
      });
      let topicCount = result.data.data;
      let tmpList = [];
      for(let domain of domains){
        let tmp = {};
        tmp.name = domain.label;
        tmp['知识主题'] = topicCount[domain.value];
        tmpList.push(tmp);
      }
      yield put({
        type: 'updateTopicCountGroupByDomainId',
        payload: {
          topicCountGroupByDomainId: tmpList
        }
      })
    },
    *getAssembleCountByDomainId(action, { put, call }){
      const domains = action.payload.domains;
      let query = '';
      for(let domain of domains){
        query += 'domainIds=' + domain.value + '&';
      }
      const result = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/statistics/countAssembleGroupByDomainIds?' + query,
        method: 'get'
      });
      let assembleCount = result.data.data;
      let tmpList = [];
      for(let domain of domains){
        let tmp = {};
        tmp.name = domain.label;
        tmp['知识单元'] = assembleCount[domain.value];
        tmpList.push(tmp);
      }
      yield put({
        type: 'updateAssembleCountGroupByDomainId',
        payload: {
          assembleCountGroupByDomainId: tmpList
        }
      })
    },
    *getQuery(action, { put, call }){


      yield put({
        type: 'updateQueryString',
        payload: {
          queryString: action.payload.queryString,
        }
      });


      const result = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8041/es/search',
        method: 'get',
        params: {
          q: action.payload.queryString,
          subjectName: action.payload.querySubjectName,
          domainName: action.payload.queryDomainName,
          topicName: action.payload.queryTopicName,
          facetName: action.payload.queryFacetName,
          facetLayer: action.payload.queryFacetLayer,
          assembleSource: action.payload.queryAssembleSource,
          assembleType: action.payload.queryAssembleType,
          page: action.payload.queryPage,
          size: action.payload.querySize,
        }
      });
      yield put({
        type: 'updateQueryFilterResult',
        payload: {
          queryFilterResult: result.data.aggs
        }
      });
      yield put({
        type: 'updateQueryAssembleResult',
        payload: {
          queryAssembleResult: result.data.hits
        }
      });
      yield put({
        type: 'updateQueryCount',
        payload: {
          queryCount: result.data.total,
        }
      });
      yield put({
        type: 'updateQueryUseTime',
        payload: {
          queryUseTime: result.data.usetime,
        }
      });

      yield put({
        type: 'updateQueryPage',
        payload:{
          queryPage: action.payload.queryPage
        }
      });
    }
  },
  reducers: {
    add(state, action){
      return {
        ...state, figurecard: [
          {
            icon: 'database',
            title: '学科',
            number: action.payload.subjectCount,
            color: 'green',
          }, {
            icon: 'book',
            title: '课程',
            number: action.payload.domainCount,
            color: 'pink',
          }, {
            icon: 'read',
            title: '知识主题',
            number: action.payload.topicCount,
            color: 'blue',
          }, {
            icon: 'profile',
            title: '知识单元',
            number: action.payload.assembleCount,
            color: 'yellow',
          }
        ]
      }
    },
    updateSelect(state, action){
      return {
        ...state, options: action.payload.options
      }
    },
    updateGexf(state, action){
      return {
        ...state, kfdata: action.payload.kfdata
      }
    },
    updateDefaultSelect(state, action){
      return {
        ...state, defaultSelect: action.payload.defaultSelect
      }
    },
    updateCurrentSubjectAndDomain(state, action){
      const subjectAndDomain = state.options;
      const currentSubjectAndDomain = action.payload.currentSubjectAndDomain;
      let tmp = [];
      switch (currentSubjectAndDomain.length) {
        case 1:
          for(let subject of subjectAndDomain){
            if(subject.value === currentSubjectAndDomain[0]){
              tmp.push(subject.label);
              break;
            }
          }
          break;
        case 2:
          for(let subject of subjectAndDomain){
            if(subject.value === currentSubjectAndDomain[0]){
              tmp.push(subject.label);
              for(let domain of subject.children){
                if(domain.value === currentSubjectAndDomain[1]){
                  tmp.push(domain.label);
                  break;
                }
              }
              break;
            }
          }
          break;
        default:
          break;
      }
      return {
        ...state, currentSubjectAndDomain: tmp
      }
    },
    updateAssembleCountGroupByTopicId(state, action){
      return {
        ...state, assembleCountGroupByTopicId: action.payload.assembleCountGroupByTopicId
      }
    },
    updateFirstLayerFacetCountGroupByTopicId(state, action){
      return {
        ...state, firstLayerFacetCountGroupByTopicId: action.payload.firstLayerFacetCountGroupByTopicId
      }
    },
    updateTopicCountGroupByDomainId(state, action){
      return {
        ...state, topicCountGroupByDomainId: action.payload.topicCountGroupByDomainId
      }
    },
    updateAssembleCountGroupByDomainId(state, action){
      return {
        ...state, assembleCountGroupByDomainId: action.payload.assembleCountGroupByDomainId
      }
    },
    updateQueryString(state, action){
      return {
        ...state, queryString: action.payload.queryString
      }
    },
    updateQuerySubjectName(state, action){
      return {
        ...state, querySubjectName: action.payload.querySubjectName
      }
    },
    updateQueryDomainName(state, action){
      return {
        ...state, queryDomainName: action.payload.queryDomainName
      }
    },
    updateQueryTopicName(state, action){
      return {
        ...state, queryTopicName: action.payload.queryTopicName
      }
    },
    updateQueryFacetName(state, action){
      return {
        ...state, queryFacetName: action.payload.queryFacetName
      }
    },
    updateQueryFacetLayer(state, action){
      return {
        ...state, queryFacetLayer: action.payload.queryFacetLayer
      }
    },
    updateQueryAssembleSource(state, action){
      return {
        ...state, queryAssembleSource: action.payload.queryAssembleSource
      }
    },
    updateQueryAssembleType(state, action){
      return {
        ...state, queryAssembleType: action.payload.queryAssembleType
      }
    },
    updateQueryPage(state, action){
      return {
        ...state, queryPage: action.payload.queryPage
      }
    },
    updateQuerySize(state, action){
      return {
        ...state, querySize: action.payload.querySize
      }
    },
    updateQueryAssembleResult(state, action){
      return {
        ...state, queryAssembleResult: action.payload.queryAssembleResult
      }
    },
    updateQueryFilterResult(state, action){
      return {
        ...state, queryFilterResult: action.payload.queryFilterResult
      }
    },
    updateQueryCount(state, action){
      return {
        ...state, queryCount: action.payload.queryCount
      }
    },
    updateQueryUseTime(state, action){
      return {
        ...state, queryUseTime: action.payload.queryUseTime
      }
    }
  }
}
