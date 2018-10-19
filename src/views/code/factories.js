import {smartTable} from 'smart-table-core';

const extension1 = function ({tableState, data, table}) {
    return {
        greet() {
            console.log('hello');
        }
    };
};

const extension2 = function ({tableState, data, table}) {
    return {
        foo() {
            //...
        }
    };
};

const data = [
    {surname: 'Deubaze', name: 'Raymond'},
    {surname: 'Foo', name: 'Bar'},
    {surname: 'Doe', name: 'John'}
];

const table = smartTable({data}, extension1, extension2);

table.greet();
table.foo();
