import {smartTable} from 'smart-table-core';

const defaultTableState = {sort: {}, filter: {}, search: {}, slice: {page: 1}};
//an extra (useless) behavior
const smartTableExtension = function ({table, tableState, data}) {
    return {
        resetAndRemoveFirst() {
            //example: modify the shared instance of tableState
            Object.assign(tableState, defaultTableState);
            //example: use core api (emitting an event here, and calling a refresh)
            table.dispatch('TABLE_RESET');
            //example: use data collection reference (here remove first item)
            data.splice(0, 1);

            table.exec();
        }
    };
};

// our composed factory
const superSmartTable = function ({data, tableState = defaultTableState}) {
    const core = smartTable({data, tableState});
    return Object.assign({}, core, smartTableExtension({data, tableState, table: core})); //compose
};

//use our super smart table
// your data
const data = [
    {surname: 'Deubaze', name: 'Raymond'},
    {surname: 'Foo', name: 'Bar'},
    {surname: 'Doe', name: 'John'}
];

const table = superSmartTable({
    data,
    tableState: {sort: {pointer: 'surname'}, filter: {}, search: {}, slice: {page: 1}}
});

// core methods available (here print the displayed data)
table.onDisplayChange(items => console.table(items.map(i => i.value)));

//new methods available as well
table.resetAndRemoveFirst();



