import React from 'react'
import classnames from 'classnames'
import { Row, Col, Card, Icon } from 'antd'
import styles from './figurecard.less'

class FigureCard extends React.Component {
  render () {
    const { figurecard } = this.props

    return (
      <div>
        <Row gutter={16} className={styles.showcase}>
          {
            figurecard.map((v, k) => {
              return (
                <Col xs={24} sm={24} md={24} lg={24} xl={24} key={k} style={{ marginBottom: 30 }}>
                  <Card
                    title={
                      <div>
                        <div className={classnames(styles['card-header'], {[styles[v.color]]: true})}>
                          <h4><Icon type={v.icon} /></h4>
                        </div>
                        <div className={styles['card-content']}>
                          <p className={styles.category}>{v.title}</p>
                          <h3>
                            {v.number}
                          </h3>
                        </div>
                      </div>}
                    bordered={false}
                    hoverable={false}
                    bodyStyle={{display: 'none'}}
                    headStyle={{paddingLeft: '0px'}}>
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </div>
    )
  }
}

FigureCard.propTypes = {}

export default FigureCard
