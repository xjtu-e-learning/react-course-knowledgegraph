import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/pie';



class Dependencechart extends React.Component {

  render() {
    const { topicList, dependenceList } = this.props;
    if(topicList.length === 0 || dependenceList.length === 0) return null;
    // let graph = dataTool.gexf.parse(kfdata);
    let nodes = topicList.slice(0);
    nodes.forEach(function (node) {
      node.name = node.topicName;
      node.id = node.topicName;
      node.itemStyle = null;
      node.symbolSize = 20;
      node.value = node.symbolSize;
      // node.category = node.attributes.modularity_class;
      // Use random x, y
      node.x = node.y = null;
      node.draggable = true;
      node.label = {
        normal: {
          show: node.symbolSize > 0
        }
      };
    });
    let option = {
      title: {
        text: 'Les Miserables',
        subtext: 'Default layout',
        top: 'bottom',
        left: 'right'
      },
      tooltip: {},
      animation: false,
      series : [
        {
          name: 'Les Miserables',
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: dependenceList,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [0.5, 7],
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

    return (
      <ReactEchartsCore echarts={echarts} option={option} style={{ height: '600px', width: '800px', margin: 'auto' }}/>
    );
  }
}

export default Dependencechart;
