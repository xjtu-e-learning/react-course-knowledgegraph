import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import dataTool from '../../lib/dataTool';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/pie';



class Forest extends React.Component {

  render() {
    const { kfdata } = this.props;
    if(kfdata === '') return null;
    let graph = dataTool.gexf.parse(kfdata);
    var categories = [];
    for (var i = 0; i < 9; i++) {
      categories[i] = {
        name: '类目' + i
      };
    }
    graph.nodes.forEach(function (node) {
      node.itemStyle = null;
      node.symbolSize = 20;
      node.value = node.symbolSize;
      node.category = node.attributes.modularity_class;
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
      legend: [{
        // selectedMode: 'single',
        data: categories.map(function (a) {
          return a.name;
        })
      }],
      animation: false,
      series : [
        {
          name: 'Les Miserables',
          type: 'graph',
          layout: 'force',
          data: graph.nodes,
          links: graph.links,
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

    return (
      <ReactEchartsCore echarts={echarts} option={option} style={{ height: '600px', width: '800px', margin: 'auto' }}/>
    );
  }
}

export default Forest;
