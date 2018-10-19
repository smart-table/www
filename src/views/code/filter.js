import {smartTable, filterDirective as filter} from 'smart-table-core';

const data = [
    {surname: 'Deubaze', name: 'Raymond'},
    {surname: 'Foo', name: 'Bar'},
    {surname: 'Doe', name: 'John'}
];

const smartCollection = smartTable({data});
smartCollection.onDisplayChange((items) => {
    console.log(items.map(item => item.value));
});

//create a directive bound to a filter configuration
const directive = filter({table: smartCollection, pointer: 'surname', operator: 'lt', type: 'string'});

directive.filter('f');
