import {pagination} from 'smart-table-vue';

Vue.component('Pagination', {
  mixins: [pagination],
  data: function () {
    return {
      isPreviousDisabled: true,
      isNextDisabled: false,
    }
  },
  template: `
  <td>
    <button :disabled="isPreviousDisabled" v-on:click="selectPreviousPage">Previous</button>
    <span> - Page {{stState.page}} - </span>
    <button :disabled="isNextDisabled" v-on:click="selectNextPage">Next</button>
  </td>
`,
  watch: {
    stState: function () {
      this.isPreviousDisabled = !this.stDirective.isPreviousPageEnabled();
      this.isNextDisabled = !this.stDirective.isNextPageEnabled();
    }
  }
});

// you can the use this component
/*
 <table>
...
 <tfoot>
   <tr>
   <td is="Pagination" :smart-table="smartTable"></td>
   </tr>
 </tfoot>
 </table>
 */