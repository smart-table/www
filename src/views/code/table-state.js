const tableState = {
    sort: {pointer: 'foo', direction: 'asc'},
    slice: {page: 4, size: 25},
    search: {scope: ['foo', 'bar'], value: 'blah'},
    filter: {
        foo: [{operator: 'is', value: 'blah', type: 'string'}]
    }
};
