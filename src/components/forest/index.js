import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import dataTool from '../../lib/dataTool';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend';

class Forest extends React.Component {

  render() {
    const { kfdata, currentSubjectAndDomain } = this.props;
    if(kfdata === '') return null;
    let graph = dataTool.gexf.parse(kfdata);
    let categories = [];
    let communityCount = 0;
    graph.nodes.forEach(function (node) {
      communityCount = Math.max(communityCount, node.attributes.modularity_class);
      node.itemStyle = null;
      // node.symbolSize = 1;
      node.value = node.symbolSize;
      node.category = node.attributes.modularity_class;
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

    });
    let communitySize = [];
    for (var i = 0; i <= communityCount; i++) {
      categories[i] = {name: '社团' + (i+1)};
      communitySize[i] = 0;
    }
    graph.nodes.forEach(function (node) {
      let size = node.symbolSize;
      let community = node.attributes.modularity_class;
      for (let i = 0; i <= communityCount; i++) {
        if (community === i) {
          if (size > communitySize[i]) {
            communitySize[i] = size;
            categories[i] = {name: node.name};
          }
        }
      }
    });
    let option = {
      title: {
        text: currentSubjectAndDomain[1],
        subtext: currentSubjectAndDomain[0],
        top: '90%',
        left: 'right'
      },
      tooltip: {},
      legend: [{
        // selectedMode: 'single',
        data: categories.map(function (a) {
          return a.name;
        })
      }],
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series : [
        {
          name: 'Les Miserables',
          type: 'graph',
          layout: 'none',
          data: graph.nodes,
          links: graph.links,
          // left: 20,
          width: '100%',
          // height: '100%',
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
          // force: {
          //   repulsion: 200
          // },
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

    return (
      <ReactEchartsCore ref={(e) => { this.echarts_react = e; }} echarts={echarts} option={option} style={{ height: '600px', width: '800px', margin: 'auto' }}/>
    );
  }

  componentDidMount() {

  }
}

export default Forest;
