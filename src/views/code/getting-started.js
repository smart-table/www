import {smartTable} from 'smart-table-core';

// your data
const data = [
    {surname: 'Deubaze', name: 'Raymond'},
    {surname: 'Foo', name: 'Bar'},
    {surname: 'Doe', name: 'John'}
];

//you have now a smart collection !
const smartCollection = smartTable({data});

//print data anytime the state change
smartCollection.onDisplayChange((items) => {
    console.log(items.map(item => item.value));
});

//sort for example
smartCollection.sort({pointer: 'name', direction: 'desc'});
// > the sorted data should be printed in the console.
