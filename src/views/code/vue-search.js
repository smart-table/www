import {search} from 'smart-table-vue';

Vue.component('SearchInput', {
  template: `
<label>
    Search:
    <input type="search" v-model="searchText" placeholder="Case sensitive search"/>
</label>`,
  mixins: [search],
  data: function () {
    return {searchText: ''}
  },
  created(){
    this.commit = (val) => this.search(val); //this.search is the directive method
  },
  watch: {
    searchText: function (val) {
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
   <search-input :smart-table="smartTable" :st-search-scope="searchScopeArray"/>
   </th
 </tr>
 </thead>
 ...
 </table>
 `
 */