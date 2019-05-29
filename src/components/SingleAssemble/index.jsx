import React from 'react';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import LinesEllipsis from 'react-lines-ellipsis'
import { Card } from 'antd';
import './index.css';

class SingleAssemble extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      replicate: true
    }
  }

  onClick = () => {
    this.setState({replicate : !this.state.replicate});
  };

  componentWillReceiveProps = ()=>{
    this.setState({replicate: true})
  };


  render(){
    const { hitAssemble, searchpage } = this.props;
    return (
      <div>
      { searchpage ?
        <Card title={hitAssemble.subject_name.replace(/<[^>]+>/g,"") + ' - ' + hitAssemble.domain_name.replace(/<[^>]+>/g,"") + ' - ' + hitAssemble.facet_name.replace(/<[^>]+>/g,"")}>
          {
            this.state.replicate ?
              <div onClick={this.onClick}>
                <HTMLEllipsis
                  unsafeHTML={hitAssemble.assemble_text}
                  maxLine="5"
                  ellipsisHTML="<a>...查看更多</a>"
                  basedOn="letters"
                />
              </div> :
              <div dangerouslySetInnerHTML={{__html: hitAssemble.assemble_content}}/>
          }

        </Card>:
        <Card>
          {
            this.state.replicate ?
              <div onClick={this.onClick}>
                <HTMLEllipsis
                  unsafeHTML={hitAssemble.assembleText}
                  maxLine="5"
                  ellipsisHTML="<a>...查看更多</a>"
                  basedOn="letters"
                />
              </div> :
              <div dangerouslySetInnerHTML={{__html: hitAssemble.assembleContent}}/>
          }

        </Card>
      }
      </div>
    );
  }
}

export default SingleAssemble;
