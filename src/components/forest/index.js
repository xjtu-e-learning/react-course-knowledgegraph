import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import dataTool from '../../lib/dataTool';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend';

class Forest extends React.Component {

  onNodeClick = (data) => {
      if (data.dataType === 'node'){
          this.props.updateCourseName(data.data.id)
      }
  };


  render() {
    const { kfdata, currentSubjectAndDomain, subjectkfdata } = this.props;
    // 绑定点击事件
    const onEvents = {'click':this.onNodeClick.bind(this)};
    let data = currentSubjectAndDomain.length === 2 ? kfdata : subjectkfdata;
    if(data === '') return null;
    let graph = dataTool.gexf.parse(data);
    console.log('---', graph);
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
      node.symbolSize = node.symbolSize / 3 + 6;
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
            categories[i] = {name: node.name};

          }
        }
      }
    });
    let option = {
      title: {
        text: currentSubjectAndDomain.length === 2 ? currentSubjectAndDomain[1] : currentSubjectAndDomain[0],
        subtext: currentSubjectAndDomain.length === 2 ? currentSubjectAndDomain[0] : '',
        top: '90%',
        left: 'right'
      },
      tooltip: {},
      legend: {
        // selectedMode: 'single',
        top:'top',
        data: categories.map(function (a) {
          return a.name;
        }),
        textStyle: {
          fontSize: 14
        }
      },
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
          top:'15%',
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
              width: 3
            }
          }
        }
      ]
    };

    return (
      <ReactEchartsCore ref={(e) => { this.echarts_react = e; }} echarts={echarts} option={option} onEvents={onEvents} style={{ height: '90%', width: '800px', margin: 'auto' }}/>
    );
  }

  componentDidMount() {

  }
}

export default Forest;
