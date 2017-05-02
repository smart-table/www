import {table} from 'smart-table-core';
import {table as tableMixin} from 'smart-table-vue'

// your smart table instance
const persons = table({
  data: [
    { surname: "Renard", name: "Laurent" },
    { surname: "Leponge", name: "Bob" }
  ]
});

// your table component (using the table component)
Vue.component("PersonTable", {
  mixins: [tableMixin],
  template: `
    <table>
      <thead>
          <tr>
            <th>Surname</th>
            <th>Name</th>
          </tr>
      </thead>
      <tbody>
      <tr v-for="item in displayed">
        <td>{{item.value.surname}}</td>
        <td>{{item.value.name}}</td>
      </tr>
      </tbody>
    </table>
    `
});

//your app: the table component is mounted and ready to be used (ie the displayed collection will react on any table state change)
new Vue({
  el: "#container",
  data: {
    smartTable: persons
  },
  template: `<Person-table :smart-table="smartTable"/>`
});