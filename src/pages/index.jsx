import React from 'react';
import styles from './index.css';
import { Row, Col} from 'antd';
import { connect } from 'dva';
import FigureCard from '../components/figurecard'
import Multiselect from '../components/multiselect';
import Barchart from '../components/Barchart';
import Forest from '../components/forest';
class Dashboard extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/getSubject'
    });
  }

  onChange = (value) => {
    const { dispatch } = this.props;
    const { options } = this.props.dashboard;
    let domains = [];
    for(let subject of options){
      if(subject.value === value[0]){
        domains = subject.children;
      }
    }
    dispatch({
      type: 'dashboard/updateCurrentSubjectAndDomain',
      payload: {
        currentSubjectAndDomain: value
      }
    });
    switch(value.length){
      case 2:
        let domainName = '';
        for(let domain of domains){
          if(domain.value === value[1]){
            domainName = domain.label;
            break;
          }
        }
        dispatch({
          type: 'dashboard/getFirstLayerFacetGroupByTopicIds',
          payload: {
            domainId: value[1]
          }
        });
        dispatch({
          type: 'dashboard/getAssembleCountByTopicId',
          payload: {
            domainId: value[1]
          }
        });
        dispatch({
          type: 'dashboard/getGexf',
          payload: {
            domainName
          }
        });
        break;
      case 1:
        dispatch({
          type: 'dashboard/getTopicCountGroupByDomainId',
          payload: {
            domains
          }
        });
        dispatch({
          type: 'dashboard/getAssembleCountByDomainId',
          payload: {
            domains
          }
        });
        break;
    }
  }

  render(){
    const {dashboard} = this.props;
    const {figurecard, options, assembleCountGroupByDomainId, firstLayerFacetCountGroupByTopicId, assembleCountGroupByTopicId, topicCountGroupByDomainId, kfdata, defaultSelect, currentSubjectAndDomain} = dashboard;
    const figurecardProps = {figurecard};
    const optionsProps = {options};
    const kfdataProps = {kfdata};
    const defaultSelectProps = {defaultSelect};
    return (
      <div className={styles.normal}>
        <Row>
          <Col xs={8} sm={8} md={8} lg={8} xl={3}><FigureCard {...figurecardProps} /></Col>
          <Col xs={16} sm={16} md={16} lg={16} xl={9}>
            <Multiselect {...optionsProps} {...defaultSelectProps} onChange={this.onChange}/>
            {
              (currentSubjectAndDomain.length === 2 && <div>
                <Barchart data={firstLayerFacetCountGroupByTopicId} dataKey='属性'/>
                <Barchart data={assembleCountGroupByTopicId} dataKey='知识碎片'/>
              </div>) ||
              (currentSubjectAndDomain.length === 1 && <div>
                <Barchart data={topicCountGroupByDomainId} dataKey='知识主题'/>
                <Barchart data={assembleCountGroupByDomainId} dataKey='知识碎片'/>
              </div>)
            }

          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Forest {...kfdataProps} currentSubjectAndDomain={currentSubjectAndDomain}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export  default connect(({dashboard}) => ({dashboard}))(Dashboard);

