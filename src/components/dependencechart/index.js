import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/pie';
import dataTool from '../../lib/dataTool';


class Dependencechart extends React.Component {

  render() {
    const { topicList, dependenceList, kfdata } = this.props;
    if(topicList.length === 0 || dependenceList.length === 0) return null;
    let graph = dataTool.gexf.parse(kfdata);
    graph.nodes.forEach(function(node){
      node.itemStyle = null;
      node.symbolSize = 20;
      node.value = node.symbolSize;
      node.label = {
        normal: {
          show: node.symbolSize > 0
        }
      };
    });
    graph.links = dependenceList;
    let option = {
      // title: {
      //   text: 'Les Miserables',
      //   subtext: 'Default layout',
      //   top: 'bottom',
      //   left: 'right'
      // },
      tooltip: {},
      animation: false,
      series : [
        {
          name: 'Les Miserables',
          type: 'graph',
          layout: 'none', //none
          data: graph.nodes,
          links: dependenceList.map(dep => { // 优先使用id，其次是name
            return {
              source: graph.nodes.find(n => n.name === dep.source)?.id || dep.source,
              target: graph.nodes.find(n => n.name === dep.target)?.id || dep.source
            }
          }),
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [0.5, 7],
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
      <ReactEchartsCore echarts={echarts} option={option} style={{ height: '600px', width: '800px', margin: 'auto' }}/>
    );
  }
}

export default Dependencechart;
