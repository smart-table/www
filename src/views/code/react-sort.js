import React from 'react';
import reactSt from './smart-table.js';

// your pure component
function Header (props) {
  const {stSort, stDirective, stState, children} = props;
  const {pointer, direction} = stState;
  let className = '';
  if (pointer === stSort) {
    if (direction === 'asc') {
      className = 'st-sort-asc';
    } else if (direction === 'desc') {
      className = 'st-sort-desc';
    }
  }
  return <th className={className} onClick={stDirective.toggle}>{children}</th>;
}

//note the use of the sort HOC
const SortableHeader = reactSt.sort(Header);

/*
to be used like

...

 <tr>
   <SortableHeader smartTable={t} stSort="surname" stSortCycle={true}>Surname</SortableHeader>
   <SortableHeader smartTable={t} stSort="name">Name</SortableHeader>
 </tr>

...

 */
