import React from 'react';
import st from './smart-table.js';
import {debounce} from './helpers'; // a debounce function


export const FilterTextInput = st.filter(class FilterInput extends React.Component {
  constructor (props) {
    const {stDirective} = props;
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {value: ''};
    this.commitChange = debounce(() => {
      stDirective.filter(this.state.value);
    }, props.delay || 300)
  }

  onChange (e) {
    const value = e.target.value.trim();
    this.setState({value});
    this.commitChange();
  }

  render () {
    const {label} = this.props;
    return (
      <label>
        {label}
        <input placeholder={this.props.placeholder}
               value={this.state.value}
               onInput={this.onChange}/>
      </label>
    );
  }
});

/*
 To be used

 <FilterTextInput label="surname" smartTable={t} stFilter="surname" />
 <FilterTextInput label="name" smartTable={t} stFilter="name" stFilterOperator="is" />

 */