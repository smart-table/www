import {smartTable} from 'smart-table-core';

const loggerAdvice = (...fns) => object => {
    const output = Object.assign({}, object);
    const methods = Object.keys(object).filter(key => typeof object[key] === 'function' && fns.includes(key));
    for (let method of methods) {
        output[method] = (...args) => {
            console.log(`${method} called`);
            return object[method](...args);
        };
    }
    return output;
};

const logCoreMethods = loggerAdvice('sort', 'filter', 'search', 'slice');

const smartTableExtension = function ({table}) {
    return logCoreMethods(table);
};

// our composed factory
const superSmartTable = function ({data}) {
    const core = smartTable({data});
    return smartTableExtension({table: core});
};

//use our super smart table
const data = [
    {surname: 'Deubaze', name: 'Raymond'},
    {surname: 'Foo', name: 'Bar'},
    {surname: 'Doe', name: 'John'}
];

const table = superSmartTable({data});

table.sort({pointer: 'name'});
// > 'sort called'

