import React from 'react';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import LinesEllipsis from 'react-lines-ellipsis'
import { Card } from 'antd';
class SingleAssemble extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      replicate: true
    }
  }

  onClick = () => {
    this.setState({replicate : !this.state.replicate});
  }

  render(){
    const { hitAssemble } = this.props;
    return (
      <Card title={''}>
        {
          this.state.replicate ?
            <div onClick={this.onClick}>
              <HTMLEllipsis
                unsafeHTML={hitAssemble.assemble_content}
                maxLine="5"
                ellipsisHTML="<a>...查看更多</a>"
                basedOn="letters"
              />
            </div> :
            <div dangerouslySetInnerHTML={{__html: hitAssemble.assemble_content}}/>
        }

      </Card>
    );
  }
}

export default SingleAssemble;
