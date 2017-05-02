import {filter} from 'smart-table-vue';

Vue.component('FilterInput', {
  template: `
<label>
    {{label}}
    <input v-model="filterText"/>
</label>`,
  mixins: [filter],
  props:['label'],
  data: function () {
    return {filterText: ''}
  },
  created(){
    this.commit = (val) => this.filter(val)
  },
  watch: {
    filterText: function (val) {
      this.commit(val);
    }
  }
});

//you can then use this component in other component template passing the relevant configuration
/*
 `
 <table>
 <thead>
 <tr>
 <th>
 <filter-input :smart-table="smartTable" st-filter="name.first" label="filter first name"/>
 </th
 </tr>
 </thead>
 ...
 </table>
 `
 */