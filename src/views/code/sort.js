import {table as smartTable, sort} from 'smart-table-core';

const data = [
  {surname: 'Deubaze', name: 'Raymond'},
  {surname: 'Foo', name: 'Bar'},
  {surname: 'Doe', name: 'John'}
];

const smartCollection = smartTable({data});

smartCollection.onDisplayChange((items) => {
  console.log(items.map(item => item.value));
});

//create a directive bound to surname
const directive = sort({table: smartCollection, pointer: 'surname'});

//sort by surname column (ascending direction first)
directive.toggle();