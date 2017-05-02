import {sort} from 'smart-table-vue';

//use "sort" mixin to add a sortable behavior to an header
Vue.component("SortableHeader", {
  mixins: [sort],
  template: `<th v-bind:class="[activeClass]"  v-on:click="toggle"><slot></slot></th>`,
  data: function () {
    return {activeClass: ""};
  },
  watch: {
    stState: function (val) {
      const {pointer, direction} = val;
      if (pointer === this.stSort) {
        this.activeClass = direction === "asc"
          ? "st-sort-asc"
          : direction === "desc" ? "st-sort-desc" : "";
      } else {
        this.activeClass = "";
      }
    }
  }
});

//you can then use this component in other component template passing the relevant configuration
/*
 `
 <table>
   <thead>
   <tr>
   <th is="sortable-header" st-sort-cycle="true" :smart-table="smartTable" st-sort="name.last">Surname</th>
   <th is="sortable-header" :smart-table="smartTable" st-sort="name.first">Name</th>
   </tr>
   </thead>
 ...
 </table>
 `
 */