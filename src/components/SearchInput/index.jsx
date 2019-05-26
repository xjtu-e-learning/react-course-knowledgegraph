import React from 'react';
import { Icon, Input } from 'antd';

const Search = Input.Search;

class SearchInput extends React.Component {
  render() {
    return (
      <div>
        <Search placeholder='请输入要搜索的内容' onSearch={value => this.props.searchFunction(value)} enterButton={false}  />
      </div>
    );
  }
}

export default SearchInput;
