import axios from 'axios';
import { delay } from 'dva/saga';
import dataTool from '../lib/dataTool';

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
    setup({ dispatch, history }) {
    }
  },
  effects: {
    *getTopics(action, { put, call }) {
      yield put({
        type: 'updateExtractState',
        payload: {
          extractState: 'processing',
        }
      })
      const result = yield call(axios, {
        url: 'http://47.95.145.72:8087/topic/getTopicsByDomainName?domainName=' + action.payload.domainName,
        method: 'get'
      });
      let tmplist = result.data.data;
      for (let topic of tmplist) {
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
    *getGexfTopics(action, { put, call }) {
      yield put({
        type: 'updateExtractState',
        payload: {
          extractState: 'processing',
        }
      })
      // 解析gexf
      const gexf = action.payload.gexf;
      const graph = dataTool.gexf.parse(gexf);
      const nodes = graph.nodes;

      for (let topic of nodes) {
        topic.topicId = topic.id;
        topic.topicName = topic.name;
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
    *getGexfDependencies(action, { put, call }) {
      yield put({
        type: 'updateMiningState',
        payload: {
          miningState: 'processing'
        }
      });
      // 解析gexf
      const gexf = action.payload.gexf;
      const graph = dataTool.gexf.parse(gexf);
      const links = graph.links;

      for (let dependence of links) {
        let tmp = {};
        tmp.id = dependence.source + '&' + dependence.target;
        tmp.source = dependence.source;
        tmp.target = dependence.target;
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
    *getDependences(action, { put, call }) {
      yield put({
        type: 'updateMiningState',
        payload: {
          miningState: 'processing'
        }
      })
      const result = yield call(axios, {
        url: 'http://47.95.145.72:8087/dependency/getDependenciesByDomainName?domainName=' + action.payload.domainName,
        method: 'get'
      });
      let tmplist = result.data.data;
      for (let dependence of tmplist) {
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
    *getFacets(action, { put, call }) {
      yield put({
        type: 'updateDiscoverState',
        payload: {
          discoverState: 'processing'
        }
      });

      for (let topic of action.payload.topicList) {
        let facetList;
        try{
          const result = yield call(axios, {
            url: 'http://47.95.145.72:8087/facet/getFirstLayerFacetsByDomainNameAndTopicName?domainName=' + action.payload.domainName + '&topicName=' + encodeURIComponent(topic.topicName),
            method: 'get',
          });
          facetList = result.data.data;
        } catch(e){
          facetList = [];
        }

        yield put({
          type: 'updateFacetList',
          payload: {
            topicName: topic.topicName,
            facetList,
          }
        });

        let assembleList = {
          topicName: topic.topicName,
          data: {}
        };

        for (let facet of facetList) {
          try {
            const result = yield call(axios, {
              url: `http://47.95.145.72:8087/assemble/getAssemblesInFirstLayerFacet?domainName=${action.payload.domainName}&topicName=${encodeURIComponent(topic.topicName)}&firstLayerFacetName=${encodeURIComponent(facet.facetName)}`,
              method: 'get'
            });
            assembleList.data[facet.facetName] = result.data.data;
          } catch (e) {
            assembleList.data[facet.facetName] = [];
          }



        }

        yield put({
          type: 'updateAssembleList',
          payload: {
            assemble: assembleList
          }
        })
      }
      yield put({
        type: 'updateDiscoverState',
        payload: {
          discoverState: 'finish'
        }
      });

      yield put({
        type: 'updateStep',
        payload: {
          step: 3
        }
      })
    },
  },
  reducers: {
    reset(state, action) {
      return {
        ...state,
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
      }
    },
    updateTopicList(state, action) {
      return {
        ...state,
        topicList: [action.payload.topic].concat(state.topicList),
      };
    },
    updateExtractState(state, action) {
      return {
        ...state,
        extractState: action.payload.extractState,
      };
    },
    updateDependenceList(state, action) {
      return {
        ...state,
        dependenceList: [action.payload.dependence].concat(state.dependenceList)
      };
    },
    updateMiningState(state, action) {
      return {
        ...state,
        miningState: action.payload.miningState
      };
    },
    updateDiscoverState(state, action) {
      return {
        ...state,
        discoverState: action.payload.discoverState,
      }
    },
    updateFacetList(state, action) {
      let tmp = state.facetList;
      tmp[action.payload.topicName] = action.payload.facetList;
      return {
        ...state,
        facetList: tmp
      }
    },
    updateCrawlState(state, action) {
      return {
        ...state,
        crawlState: action.payload.crawlState,
      }
    },
    updateAssembleList(state, action) {
      return {
        ...state,
        assembleList: [action.payload.assemble].concat(state.assembleList),
      }
    },
    updateStep(state, action) {
      return {
        ...state,
        step: action.payload.step
      }
    },
    updateVisible(state, action) {
      return {
        ...state,
        visible: action.payload.visible
      }
    }
  }
}
