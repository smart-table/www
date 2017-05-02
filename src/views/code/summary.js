import {default as smartTable, summary} from 'smart-table-core';

const data = [
  {surname: 'Deubaze', name: 'Raymond'},
  {surname: 'Foo', name: 'Bar'},
  {surname: 'Doe', name: 'John'}
];

const smartCollection = smartTable({data});

const directive = summary({table: smartCollection});

directive.onSummaryChange(({page, size, filteredCount}) => {
  console.log(`page: ${page}`);
  console.log(`size: ${page}`);
  console.log(`filtered items count: ${filteredCount}`);
});

smartCollection.exec();