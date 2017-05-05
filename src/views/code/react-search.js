import React from 'react';
import stSearch  from '../smart-table-preact';
import {debounce} from './helpers' // a debounce helper function

export const SearchInput = stSearch.search(class SearchInput extends React.Component {
  constructor (props) {
    const {stDirective} = props;
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {text: ''};
    this.commitChange = debounce(() => {
      stDirective.search(this.state.text);
    }, props.delay || 300)
  }

  onChange (e) {
    const text = e.target.value.trim();
    this.setState({text});
    this.commitChange();
  }

  render () {
    return (
      <label>
        Search Input
        <input type="search"
               placeholder={this.props.placeholder}
               value={this.state.text}
               onInput={this.onChange}/>
      </label>
    );
  }
});

/*
to be used
...
 <SearchInput placeholder="search name and surname" smartTable={t} stSearchScope={['surname', 'name']}/>
...

 */