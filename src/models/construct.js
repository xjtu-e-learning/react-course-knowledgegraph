import axios from 'axios';
import { delay } from 'dva/saga';

export default {
  namespace: 'construct',
  state: {
    topicList: [],
    extractState: 'start',
    dependenceList: [],
    miningState: 'start',
    facetList: [],
    discoverState: 'start',
    assembleList: [],
    crawlState: 'start',
    step: 0,
    visible: false,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
    }
  },
  effects: {
    *getTopics(action, { put, call }){
      yield put({
        type: 'updateExtractState',
        payload: {
          extractState: 'processing',
        }
      })
      const result = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/topic/getTopicsByDomainName?domainName=' + action.payload.domainName,
        method: 'get'
      });
      let tmplist = result.data.data;
      for(let topic of tmplist){
        yield call(delay, 100);
        yield put({
          type: 'updateTopicList',
          payload: {
            topic
          }
        })
      }
      yield put({
        type: 'updateExtractState',
        payload: {
          extractState: 'finish'
        }
      })
    },
    *getDependences(action, { put, call }){
      yield put({
        type: 'updateMiningState',
        payload: {
          miningState: 'processing'
        }
      })
      const result = yield call(axios, {
        url: 'http://yotta.xjtushilei.com:8083/dependency/getDependenciesByDomainName?domainName=' + action.payload.domainName,
        method: 'get'
      });
      let tmplist = result.data.data;
      for(let dependence of tmplist){
        let tmp = {};
        tmp.id = dependence.startTopicId + '&' + dependence.endTopicId;
        tmp.source = dependence.startTopicName;
        tmp.target = dependence.endTopicName;
        yield call(delay, 100);
        yield put({
          type: 'updateDependenceList',
          payload: {
            dependence: tmp
          }
        })
      }
      yield put({
        type: 'updateMiningState',
        payload: {
          miningState: 'finish',
        }
      })
    },
    *getFacets(action, { put, call }){
      yield put({
        type: 'updateDiscoverState',
        payload: {
          discoverState: 'processing'
        }
      });

      for(let topic of action.payload.topicList){
        const result = yield call(axios, {
          url: 'http://yotta.xjtushilei.com:8083/facet/getFirstLayerFacetsByDomainNameAndTopicName?domainName='+ action.payload.domainName +'&topicName=' + encodeURIComponent(topic.topicName),
          method: 'get',
        });

        yield put({
          type: 'updateFacetList',
          payload: {
            topicName: topic.topicName,
            facetList: result.data.data,
          }
        })
      }
      yield put({
        type: 'updateDiscoverState',
        payload: {
          discoverState: 'finish'
        }
      })
    },
    *getAssembles(action, { put, call }){
      yield put({
        type: 'updateCrawlState',
        payload: {
          crawlState: 'processing'
        }
      });

      const domainName = action.payload.domainName;
      const topicList = action.payload.topicList;
      const facetList = action.payload.facetList;

      for(let topic of topicList){
        if(facetList[topic.topicName] !== undefined){
          for(let facet of facetList[topic.topicName]){
            if(facet.facetName === '匿名分面') continue;
            const result = yield call(axios, {
              url: `http://yotta.xjtushilei.com:8083/assemble/getAssemblesInFirstLayerFacet?domainName=${domainName}&topicName=${encodeURIComponent(topic.topicName)}&firstLayerFacetName=${encodeURIComponent(facet.facetName)}`,
              method: 'get'
            });
            let tmp = {
              id: topic.topicId + '&' + facet.facetId,
              data: result.data.data,
              name: topic.topicName + '/' + facet.facetName,
              facet: facet.facetName,
              topicName: topic.topicName,
            }
            yield put({
              type: 'updateAssembleList',
              payload: {
                assemble: tmp
              }
            })
          }
        }
      }

      yield put({
        type: 'updateCrawlState',
        payload: {
          crawlState: 'finish'
        }
      })
    }
  },
  reducers: {
    updateTopicList(state, action){
      return {
        ...state,
        topicList: [action.payload.topic].concat(state.topicList),
      };
    },
    updateExtractState(state, action){
      return {
        ...state,
        extractState: action.payload.extractState,
      };
    },
    updateDependenceList(state, action){
      return {
        ...state,
        dependenceList: [action.payload.dependence].concat(state.dependenceList)
      };
    },
    updateMiningState(state, action){
      return {
        ...state,
        miningState: action.payload.miningState
      };
    },
    updateDiscoverState(state, action){
      return {
        ...state,
        discoverState: action.payload.discoverState,
      }
    },
    updateFacetList(state, action){
      let tmp = state.facetList;
      tmp[action.payload.topicName] = action.payload.facetList;
      return {
        ...state,
        facetList: tmp
      }
    },
    updateCrawlState(state, action){
      return {
        ...state,
        crawlState: action.payload.crawlState,
      }
    },
    updateAssembleList(state, action){
      return {
        ...state,
        assembleList: [action.payload.assemble].concat(state.assembleList),
      }
    },
    updateStep(state, action){
      return {
        ...state,
        step: action.payload.step
      }
    },
    updateVisible(state, action){
      return {
        ...state,
        visible: action.payload.visible
      }
    }
  }
}
