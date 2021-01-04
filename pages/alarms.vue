<template>
  <div>

    <!-- NEW ALARM FORM -->
    <div class="row">
      <div class="col-sm-12">
        <card v-if="$store.state.devices.length > 0 ">

          <div slot="header">
            <h4 class="card-title">Create new Alarm Rule {{selectedWidgetIndex}}</h4>
          </div>

          <div class="row">

            <div class="col-3" >

              <el-select required class="select-success" placeholder="Variable" v-model="selectedWidgetIndex"
                style="margin-top: 25px;">
                <el-option v-for="widget, index in $store.state.selectedDevice.template.widgets" :key="index" class="text-dark" :value="index" :label="widget.variableFullName"></el-option>
              </el-select>
              
            </div>

            <div class="col-3">
              <el-select required class="select-warning" placeholder="Condition" v-model="newRule.condition"
                style="margin-top: 25px;">
                <el-option class="text-dark" value="=" label="="></el-option>
                <el-option class="text-dark" value=">" label=">"></el-option>
                <el-option class="text-dark" value=">=" label=">="></el-option>
                <el-option class="text-dark" value="<" label="<"></el-option>
                <el-option class="text-dark" value="<=" label="<="></el-option>
                <el-option class="text-dark" value="!=" label="!="></el-option>
              </el-select>
            </div>

            <div class="col-3">
              <base-input label="Value" v-model="newRule.value" type="number"></base-input>
            </div>

            <div class="col-3">
              <base-input label="Trigger Time" v-model="newRule.triggerTime" type="number"></base-input>
            </div>

          </div>

          <br><br>

          <div class="row pull-right">

            <div class="col-12">
              <base-button @click="createNewRule()" native-type="submit" type="primary" class="mb-3" size="lg" :disabled="$store.state.devices.length == 0" >
                Add Alarm Rule
              </base-button>
            </div>

          </div>

        </card>
        <card v-else>
          You need to select a device to create an Alarm
        </card>
      </div>
    </div>

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
      selectedWidgetIndex: null,
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
