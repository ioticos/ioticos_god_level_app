<template>
  <div>

  </div>
</template>

<script>
import { Select, Option } from "element-ui";
import { Table, TableColumn } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      alarmRules: [],
      newRule: {
        dId: null,
        status: true,
        variableFullName: null,
        variable: null,
        value: null,
        condition: null,
        triggerTime: null
      }
    };
  }
};
</script>
