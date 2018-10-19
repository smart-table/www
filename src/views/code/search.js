import {smartTable, searchDirective as search} from 'smart-table-core';

const data = [
    {surname: 'Deubaze', name: 'Raymond'},
    {surname: 'Foo', name: 'Bar'},
    {surname: 'Doe', name: 'John'}
];

const smartCollection = smartTable({data});
smartCollection.onDisplayChange((items) => {
    console.log(items.map(item => item.value));
});

//create a directive bound to a search configuration
const directive = search({table: smartCollection, scope: ['surname', 'name']});

directive.search('Bar');
