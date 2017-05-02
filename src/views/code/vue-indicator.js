import {loadingIndicator} from 'smart-table-vue';

Vue.component('LoadingIndicator', {
  mixins: [loadingIndicator],
  template: `
    <div id="overlay" v-bind:class="{ 'st-working':stState.working}">
      Processing ...
    </div>`
});

//you can then use this component in other component template passing the relevant configuration
/*
 `
<div>
  <loading-indicator :smart-table="smartTable"/>
  <table>
  ...
  </table>
</div>
 `
 */