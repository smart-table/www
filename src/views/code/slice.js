import {default as smartTable, slice} from 'smart-table-core';

const data = [
  {surname: 'Deubaze', name: 'Raymond'},
  {surname: 'Foo', name: 'Bar'},
  {surname: 'Doe', name: 'John'}
];

const smartCollection = smartTable({
  data, tableState: {
    sort: {},
    filter: {},
    search: {},
    slice: {page: 1, size: 1}
  }
});

smartCollection.onDisplayChange((items) => {
  console.log(items.map(item => item.value));
});

const directive = slice({table: smartCollection});

directive.selectPage(3);