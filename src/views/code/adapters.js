import {table as smartTable} from 'smart-table-core';

const smartTableExtension = function ({table, tableState}) {
  return {
    // using eval
    sortAndReturn(sortState){
      Object.assign(tableState, {sort: sortState}); //you have to mutate table state yourself
      return table.eval();
    },
    //using event system (note you should handle error as well)
    sliceAndReturn(sliceState){
      return new Promise(function (resolve, reject) {
        //register once
        const listener = function (items) {
          resolve(items);
          table.off('DISPLAY_CHANGED', listener);
        };
        table.onDisplayChange(listener);
        table.slice(sliceState);
      });
    }
  };
};

// our composed factory
const superSmartTable = function ({data, tableState = {sort: {}, filter: {}, search: {}, slice: {page: 1}}}) {
  const core = smartTable({data, tableState});
  return smartTableExtension({table: core, tableState});
};

const data = [
  {surname: 'Deubaze', name: 'Raymond'},
  {surname: 'Foo', name: 'Bar'},
  {surname: 'Doe', name: 'John'}
];

const table = superSmartTable({data});

table.sortAndReturn({pointer: 'name'})
  .then(items => {
    console.log(items.map(i => i.value));
    return table.sliceAndReturn({page: 2, size: 1});
  })
  .then(items => {
    console.log(items.map(i => i.value));
  });