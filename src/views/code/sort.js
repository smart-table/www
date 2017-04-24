const st = require('smart-table-core');
const {'default':smartTable, sort} = st;

let c = 1;
const nextTick = function (fn) {
  c++;
  setTimeout(fn, (c * 21));
};

const data = [
  {surname: 'Deubaze', name: 'Raymond'},
  {surname: 'Foo', name: 'Bar'},
  {surname: 'Doe', name: 'John'}
];

const smartCollection = smartTable({data});

smartCollection.onDisplayChange((items) => {
  console.log(items.map(item => item.value));
});

const directive = sort({table: smartCollection, pointer: 'surname'});

nextTick(_ => directive.toggle());
nextTick(_ => directive.toggle());
nextTick(_ => directive.toggle());

