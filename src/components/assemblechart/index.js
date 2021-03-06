import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/pie';
import dataTool from '../../lib/dataTool';
import { Modal } from 'antd';
import SingleAssemble from '../SingleAssemble';


class Assemblechart extends React.Component {

  state = {
    visible: false,
    currentAssembleList: [],
    topicAndFacet: ''
  };

  showModal = (value) => {
    this.setState({
      visible: true,
      currentAssembleList: value.data,
      topicAndFacet: value.id
    })
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { topicList, dependenceList, assembleList, kfdata, domainName } = this.props;
    if (topicList.length === 0 || dependenceList.length === 0) return null;
    if (kfdata === '') return null;
    let graph = dataTool.gexf.parse(kfdata);
    let categories = [];
    let communityCount = 0;
    let nodePosition = {};
    //console.log(graph.nodes);
    graph.nodes.forEach(function (node) {
      communityCount = Math.max(communityCount, node.attributes.modularity_class);
      node.itemStyle = null;
      // node.symbolSize = 1;
      node.value = node.symbolSize;
      node.category = node.attributes.modularity_class;
      // console.log(node.category)
      // Use random x, y
      // console.log(node);
      // node.x = node.x * 2;
      // node.y = node.y * 2;
      // node.x = node.y = null;
      // node.draggable = true;
      node.label = {
        normal: {
          show: node.symbolSize > 0
        }
      };
      nodePosition[node.name] = {
        x: node.x,
        y: node.y
      };
      node.symbolSize = node.symbolSize / 3 + 6;
    });
    let communitySize = [];
    for (var i = 0; i <= communityCount; i++) {
      categories[i] = { name: '社团' + (i + 1) };
      communitySize[i] = 0;
    }
    graph.nodes.forEach(function (node) {
      let size = node.symbolSize;
      let community = node.attributes.modularity_class;
      for (let i = 0; i <= communityCount; i++) {
        if (community === i) {
          if (size > communitySize[i]) {
            communitySize[i] = size;
            categories[i] = { name: node.name };
          }
        }
      }
    });
    categories.push({ name: '知识单元' });
    // console.log(assembleList)
    // console.log(categories)
    // let nodes = topicList.slice(0);
    // nodes.forEach(function (node) {
    //   node.name = node.topicName;
    //   node.id = node.topicName;
    //   node.itemStyle = null;
    //   node.symbolSize = 20;
    //   node.value = node.symbolSize;
    //   // node.category = node.attributes.modularity_class;
    //   // Use random x, y
    //   node.x = node.y = null;
    //   node.draggable = true;
    //   node.label = {
    //     normal: {
    //       show: node.symbolSize > 0
    //     }
    //   };
    //   node.itemStyle = {
    //     color: 'brown'
    //   }
    // });
    // let assembles = assembleList.slice(0);
    let assembleNodes = [];
    let assembleEdges = [];
    // console.log(graph.nodes);

    for (let topic of assembleList) {
      let topicName = topic.topicName;
      // 有些主题数据库中有，但是知识图谱上没有
      if (nodePosition[topicName] === undefined) continue;

      let length = Object.keys(topic.data).length - 1;
      Object.keys(topic.data).forEach((facetName, i) => {

        const topicNode = graph.nodes.find(v => v.name === topicName || v.id === topicName);
        // console.log(topicNode);
        let nodeRadius = topicNode ? topicNode.symbolSize : 50;
        if(domainName.indexOf('数据结构') !== -1) {
          nodeRadius = nodeRadius * 4;
        }
        
        if (facetName !== '匿名分面') {
          let node = {
            name: facetName,
            id: topicName + '&' + facetName,
            data: topic.data[facetName],
            symbol: 'diamod',
            symbolSize: 8,
            x: nodePosition[topicName].x + 2.5 * nodeRadius * Math.sin(2 * Math.PI * i / length),
            y: nodePosition[topicName].y + 2.5 * nodeRadius * Math.cos(2 * Math.PI * i / length),
            // itemStyle: {
            //   color: 'green'
            // },
            category: '知识单元',
            label: {
              normal: {
                show: true
              }
            },
            labelLayout: {
              hideOverlap: true
            },
          };
          assembleNodes.push(node);

          let edge = {
            id: topicName + '&' + facetName,
            source: graph.nodes.find(n => n.name === topicName)?.id || topicName,
            target: topicName + '&' + facetName,
          };
          assembleEdges.push(edge);
        }

      });
    }

    // assembles.forEach(function (node) {
    //   // node.name = node.topicName;
    //   // node.id = node.topicName;
    //   node.itemStyle = null;
    //   node.symbolSize = 20;
    //   node.value = node.symbolSize;
    //   node.symbol = 'diamod'
    //   // node.category = node.attributes.modularity_class;
    //   // Use random x, y
    //   node.x = node.y = null;
    //   node.draggable = true;
    //   node.label = {
    //     normal: {
    //       show: node.symbolSize > 0
    //     }
    //   };
    //   node.itemStyle = {
    //     color: 'green'
    //   }
    // });
    // nodes = nodes.concat(assembles);
    graph.nodes = graph.nodes.concat(assembleNodes);
    graph.links = graph.links.concat(assembleEdges);
    //console.log('ll', graph.links)
    let option = {
      // title: {
      //   text: 'Les Miserables',
      //   subtext: 'Default layout',
      //   top: 'bottom',
      //   left: 'right'
      // },
      tooltip: {},
      legend: [{
        // selectedMode: 'single',
        data: categories.map(function (a) {
          return { name: a.name, icon: 'circle' };
        })
      }],
      animation: false,
      series: [
        {
          name: 'Les Miserables',
          type: 'graph',
          layout: 'none',
          data: graph.nodes,
          links: graph.links,
          width: '100%',
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [0.5, 7],
          categories: categories,
          focusNodeAdjacency: true,
          roam: true,
          label: {
            normal: {
              position: 'right'
            }
          },
          force: {
            repulsion: 200
          },
          lineStyle: {
            normal: {
              curveness: 0.25,
              color: 'source',
              width: 1
            }
          }
        }
      ]
    };

    return ([
      <ReactEchartsCore ref={(e) => { this.echarts_react = e }} echarts={echarts} option={option} style={{ height: '600px', width: '800px', margin: 'auto' }} />,
      <Modal
        title={this.state.topicAndFacet}
        visible={this.state.visible}
        onCancel={this.handleCancel}
        width={800}
        footer={null}
      >
        {(this.state.currentAssembleList || []).map(element => {
          element.assemble_content = element.assembleContent;
          return <SingleAssemble hitAssemble={element} searchpage={false} />;
        }
        )}
      </Modal>
    ]);
  }

  componentDidMount() {
    let echarts_instance = this.echarts_react.getEchartsInstance();
    let showModal = this.showModal;
    echarts_instance.on('click', function (params) {
      console.log(params);
      if (params.dataType === 'node') {
        // this.setState({currentAssembleList: });
        showModal(params.data);
      }
    });
  }
}

export default Assemblechart;
