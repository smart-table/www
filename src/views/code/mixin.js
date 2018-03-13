import {table as smartTable} from 'smart-table-core';

//change the structure of returned items
const smartTableExtension = function ({table, tableState, data}) {

  const oldChangeRegister = table.onDisplayChange;

  //will overwrite the default onDisplayChange
  return {
    onDisplayChange(listener){
      oldChangeRegister(function (items) {
        const itemValues = items.map(i => i.value);
        listener(itemValues);
      });
    }
  };
};

// our composed factory
const superSmartTable = function ({data}) {
  const core = smartTable({data});
  return Object.assign(core, smartTableExtension({table: core})); //overwrite core method by mixin the extension within the core
};

//use our super smart table
const data = [
  {surname: 'Deubaze', name: 'Raymond'},
  {surname: 'Foo', name: 'Bar'},
  {surname: 'Doe', name: 'John'}
];

const table = superSmartTable({data});

// core methods available
table.onDisplayChange(items => console.log(items)); // no need to extract "value" property as the method has been overwritten

table.exec();

