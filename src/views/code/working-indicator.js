import {default as smartTable, workingIndicator} from 'smart-table-core';

const data = [
  {surname: 'Deubaze', name: 'Raymond'},
  {surname: 'Foo', name: 'Bar'},
  {surname: 'Doe', name: 'John'}
];

const smartCollection = smartTable({data});

const directive = workingIndicator({table: smartCollection});

directive.onExecutionChange(({working}) => {
  if (working === true) {
    console.time('exec');
  } else {
    console.timeEnd('exec');
  }
});

smartCollection.exec();