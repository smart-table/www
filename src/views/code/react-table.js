import React from 'react';
import ReactDom from 'react-dom';
import reactSt from './smart-table.js';
import {smartTable as st} from 'smart-table-core';

// your row component
const Row = ({value}) => {
  const {surname, name}=value;
  return (<tr>
    <td>{surname}</td>
    <td>{name}</td>
  </tr>);
};

// your body component (connected to the smart table)
// note the usage of the table hoc
const TableBody = reactSt.table((props) => {
  const {stState} = props;
  const displayed = stState.length ? stState : [];
  return (<tbody>
  {displayed.map(({value, index}) => {
    return <Row key={index} value={value}/>
  })}
  </tbody>);
});


// mount it somewhere with your smart table
const table = st({
  data: [
    {surname: 'Renard', name: 'Laurent'},
    {surname: 'Leponge', name: 'Bob'}
  ]
});

ReactDom.render(
  <table>
    <thead>
    <tr>
      <th>Surname</th>
      <th>Name</th>
    </tr>
    </thead>
    <TableBody smartTable={table}/>
  </table>
  , document.getElementById('table-container'));
