import React from 'react';
import styles from './index.css';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import FigureCard from '../components/figurecard';
import Multiselect from '../components/multiselect';
import Barchart from '../components/Barchart';
import Forest from '../components/forest';

class Dashboard extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/getRealSubject',
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.child.updateState();
  }

  onChange = (value) => {
    const { dispatch } = this.props;
    const { options } = this.props.dashboard;
    let domains = [];
    let subjectName = '';
    for (let subject of options) {
      if (subject.value === value[0]) {
        domains = subject.children;
        subjectName = subject.label;
      }
    }
    dispatch({
      type: 'dashboard/updateCurrentSubjectAndDomain',
      payload: {
        currentSubjectAndDomain: value,
      },
    });
    switch (value.length) {
      case 2:
        let domainName = '';
        for (let domain of domains) {
          if (domain.value === value[1]) {
            domainName = domain.label;
            break;
          }
        }
        dispatch({
          type: 'construct/reset'
        });
        dispatch({
          type: 'dashboard/getFirstLayerFacetGroupByTopicIds',
          payload: {
            domainId: value[1],
          },
        });
        dispatch({
          type: 'dashboard/getAssembleCountByTopicId',
          payload: {
            domainId: value[1],
          },
        });
        dispatch({
          type: 'dashboard/getGexf',
          payload: {
            domainName,
          },
        });
        break;
      case 1:
        dispatch({
          type: 'dashboard/getTopicCountGroupByDomainId',
          payload: {
            domains,
          },
        });
        dispatch({
          type: 'dashboard/getAssembleCountByDomainId',
          payload: {
            domains,
          },
        });
        dispatch({
          type: 'dashboard/getSubjectGraph',
          payload: {
            subjectName,
          },
        });
        break;
    }
  };

  // 点击右侧图，
  updateCourseName = (courseName) => {
    //是否需要更新，如果当前选了学科和课程，则不更新
    const { dispatch } = this.props;
    const { options, currentSubjectAndDomain } = this.props.dashboard;
    if (currentSubjectAndDomain.length === 2)
      return;
    // 找当前这学科的id
    let subjectId = 0;
    let courses = [];
    for (let subject of options) {
      if (subject.label === currentSubjectAndDomain[0]) {
        subjectId = subject.value;
        courses = subject.children;
      }
    }
    let courseId = 0;
    for (let c of courses) {
      if (c.label === courseName)
        courseId = c.value;
    }
    dispatch({
      type: 'construct/reset'
    });
    dispatch({
      type: 'dashboard/updateCurrentSubjectAndDomain',
      payload: {
        currentSubjectAndDomain: [subjectId, courseId],
      },
    });
    dispatch({
      type: 'dashboard/getFirstLayerFacetGroupByTopicIds',
      payload: {
        domainId: courseId,
      },
    });
    dispatch({
      type: 'dashboard/getAssembleCountByTopicId',
      payload: {
        domainId: courseId,
      },
    });
    dispatch({
      type: 'dashboard/getGexf',
      payload: {
        domainName: courseName,
      },
    });
   

  };

  render() {
    const { dashboard } = this.props;
    const { subjectkfdata, figurecard, options, assembleCountGroupByDomainId, firstLayerFacetCountGroupByTopicId, assembleCountGroupByTopicId, topicCountGroupByDomainId, kfdata, defaultSelect, currentSubjectAndDomain } = dashboard;
    const figurecardProps = { figurecard };
    const optionsProps = { options };
    const kfdataProps = { kfdata };
    const defaultSelectProps = { defaultSelect };
    return (
      <div className={styles.normal}>
        <Row type={'flex'} justify={'space-around'}>
          <Col span={4}><FigureCard {...figurecardProps} /></Col>
          <Col span={7}>
            <Multiselect ref={(child) => {
              this.child = child;
            }} {...optionsProps} {...defaultSelectProps} currentSubjectAndDomain={currentSubjectAndDomain}
                         onChange={this.onChange}/>
            {
              (currentSubjectAndDomain.length === 2 && <div>
                <Barchart data={firstLayerFacetCountGroupByTopicId} dataKey='属性'/>
                <Barchart data={assembleCountGroupByTopicId} dataKey='知识单元'/>
              </div>) ||
              (currentSubjectAndDomain.length === 1 && <div>
                <Barchart data={topicCountGroupByDomainId} dataKey='知识主题'/>
                <Barchart data={assembleCountGroupByDomainId} dataKey='知识单元'/>
              </div>)
            }

          </Col>
          <Col span={12}>
            <Forest {...kfdataProps} currentSubjectAndDomain={currentSubjectAndDomain} subjectkfdata={subjectkfdata}
                    updateCourseName={this.updateCourseName}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard);

