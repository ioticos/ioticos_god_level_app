<template>
  <div>
    <!-- NEW ALARM FORM -->
    <div class="row">
      <div class="col-sm-12">
        <card v-if="$store.state.devices.length > 0">
          <div slot="header">
            <h4 class="card-title">
              Create new Alarm Rule {{ selectedWidgetIndex }}
            </h4>
          </div>

          <div class="row">
            <div class="col-3">
              <el-select
                required
                class="select-success"
                placeholder="Variable"
                v-model="selectedWidgetIndex"
                style="margin-top: 25px;"
              >
                <el-option
                  v-for="(widget, index) in $store.state.selectedDevice.template
                    .widgets"
                  :key="index"
                  class="text-dark"
                  :value="index"
                  :label="widget.variableFullName"
                ></el-option>
              </el-select>
            </div>

            <div class="col-3">
              <el-select
                required
                class="select-warning"
                placeholder="Condition"
                v-model="newRule.condition"
                style="margin-top: 25px;"
              >
                <el-option class="text-dark" value="=" label="="></el-option>
                <el-option class="text-dark" value=">" label=">"></el-option>
                <el-option class="text-dark" value=">=" label=">="></el-option>
                <el-option class="text-dark" value="<" label="<"></el-option>
                <el-option class="text-dark" value="<=" label="<="></el-option>
                <el-option class="text-dark" value="!=" label="!="></el-option>
              </el-select>
            </div>

            <div class="col-2">
              <base-input
                label="Value"
                v-model="newRule.value"
                type="number"
              ></base-input>
            </div>

            <div class="col-2">
              <base-input
                label="Trigger Time"
                v-model="newRule.triggerTime"
                type="number"
              ></base-input>
            </div>
            <div class="col-2 d-flex align-items-right flex-column has-label">
              <label>Telegram</label>
              <base-switch
                @click="checked = !checked;"
                :value="checked"
                type="primary"
                on-text="ON"
                off-text="OFF"
                style="margin-top: 10px;"
                class="pull-center"
                >
              </base-switch>
            </div>
            <div v-if="checked" class="col-6">
              <base-input
                label="Trigger Time telegram"
                v-model="newRule.triggerTimeTelegram"
                type="number"
                placeholder="Seconds"
              ></base-input>
            </div>
            <div v-if="checked" class="col-6">
              <base-input
                label="Telegram ID"
                v-model="newRule.telegramID"
                type="number"
                @input="handleTelegramIdInput"
              ></base-input>
            </div>
          </div>

          <br /><br />

          <div class="row">
            <div class="col-12 d-flex justify-content-between">
              <base-button
                native-type="submit"
                type="link"
                class="mb-3"
                size="lg"
                :disabled="$store.state.devices.length == 0"
              >
                How i add my telegram?
              </base-button>

              <base-button
                @click="createNewRule()"
                native-type="submit"
                type="primary"
                class="mb-3"
                size="lg"
                :disabled="$store.state.devices.length == 0 || isButtonEnabled"
              >
                {{  !isButtonEnabled ? "Add Alarm Rule" : "Creating..."}}
              </base-button>

            </div>
          </div>
        </card>
        <card v-else>
          You need to select a device to create an Alarm
        </card>
      </div>
    </div>

    <!-- ALARMS TABLE -->
    <div class="row" v-if="$store.state.devices.length > 0">
      <div class="col-sm-12">
        <card>
          <div slot="header">
            <h4 class="card-title">Alarm Rules</h4>
          </div>

          <el-table
            v-if="$store.state.selectedDevice.alarmRules.length > 0"
            :data="$store.state.selectedDevice.alarmRules"
          >
            <el-table-column min-width="50" label="#" align="center">
              <div class="photo" slot-scope="{ row, $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>

            <el-table-column
              prop="variableFullName"
              label="Var Name"
            ></el-table-column>

            <el-table-column prop="variable" label="Var"></el-table-column>

            <el-table-column
              prop="condition"
              label="Condition"
            ></el-table-column>

            <el-table-column prop="value" label="Value"></el-table-column>

            <el-table-column
              prop="triggerTime"
              label="Trigger Time"
            ></el-table-column>

            <el-table-column prop="counter" label="Matches"></el-table-column>

            <el-table-column min-width="110" header-align="right" align="right" label="Actions">
              <div
                slot-scope="{ row, $index }"
                class="text-right table-actions"
              >
                <el-tooltip content="Delete" effect="light" placement="top">
                  <base-button
                    @click="deleteDevice(row)"
                    type="danger"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-simple-remove "></i>
                  </base-button>
                </el-tooltip>

                <el-tooltip content="Rule Status" style="margin-left: 20px;">
                  <i
                    class="fas fa-exclamation-triangle"
                    :class="{ 'text-warning': row.status }"
                  ></i>
                </el-tooltip>

                <!-- no ato row.status al v model porque al cambiar de status cambiaria directo sobre store lo que daría error en 
                      cambio uso el value, al accionar el switch no cambiará el objeto, pero podré cambiar el valor en la función -->
                <el-tooltip
                  content="Change Rule Status"
                  style="margin-left: 5px;"
                >
                  <base-switch
                    @click="updateStatusRule(row)"
                    :value="row.status"
                    type="primary"
                    on-text="ON"
                    off-text="OFF"
                    style="margin-top: 10px;"
                  ></base-switch>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>

          <h4 v-else class="card-title">No Alarm Rules</h4>
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
      isButtonEnabled: false,
      checked: false,
      alarmRules: [],
      selectedWidgetIndex: null,
      newRule: {
        dId: null,
        deviceName: null,
        status: true,
        variableFullName: null,
        variable: null,
        value: null,
        condition: null,
        triggerTime: null,
        triggerTimeTelegram: null,
        telegramID:  this.$store.state.auth.userData.telegramID
      }
    };
  },
  methods: {
    handleTelegramIdInput() {
      if (this.newRule.telegramID.length > 10) {
        this.newRule.telegramId = this.user.telegramId.slice(0, 10);
      }
    },


    deleteDevice(rule) {

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          emqxRuleId: rule.emqxRuleId
        }
      };

      this.$axios
        .delete("/alarm-rule", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Alarm Rule was deleted"
            });
            this.$store.dispatch("getDevices");
            return;
          }
        })
        .catch(e => {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    },

    updateStatusRule(rule) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      var ruleCopy = JSON.parse(JSON.stringify(rule));

      ruleCopy.status = !ruleCopy.status;

      const toSend = { rule: ruleCopy };

      this.$axios
        .put("/alarm-rule", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Alarm Rule was updated"
            });

            this.$store.dispatch("getDevices");

            return;
          }
        })
        .catch(e => {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    },

    createNewRule() {
      this.isButtonEnabled = true;
      if (this.selectedWidgetIndex == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Variable must be selected"
        });
        this.isButtonEnabled = false
        return;
      }

      if (this.newRule.condition == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Condition must be selected"
        });
        this.isButtonEnabled = false
        return;
      }

      if (this.newRule.value == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Value is empty"
        });
        this.isButtonEnabled = false
        return;
      }

      if (this.newRule.triggerTime == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Trigger Time is empty"
        });
        this.isButtonEnabled = false
        return;
      }
      if (this.newRule.triggerTimeTelegram == null && this.checked) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Trigger Time Telegram is empty"
        });
        this.isButtonEnabled = false
        return;
      }
      if (this.newRule.telegramID == null && this.checked) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Telegram is empty"
        });
        this.isButtonEnabled = false
        return;
      }

      this.newRule.dId = this.$store.state.selectedDevice.dId;
      this.newRule.deviceName = this.$store.state.selectedDevice.name;
      this.newRule.variableFullName = this.$store.state.selectedDevice.template.widgets[
        this.selectedWidgetIndex
      ].variableFullName;
      this.newRule.variable = this.$store.state.selectedDevice.template.widgets[
        this.selectedWidgetIndex
      ].variable;
      if(this.newRule.telegramID == null || !this.checked ) delete this.newRule.telegramID;
      if(this.newRule.triggerTimeTelegram == null || !this.checked ) delete this.newRule.triggerTimeTelegram;


      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      var toSend = {
        newRule: this.newRule
      };

      this.$axios
        .post("/alarm-rule", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.newRule.variable = null;
            this.newRule.condition = null;
            this.newRule.value = null;
            this.newRule.triggerTime = null;
            this.newRule.triggerTimeTelegram = null;
            this.newRule.telegramID = this.$store.state.auth.userData.telegramID;
            this.selectedWidgetIndex = null;
            this.triggerTimeTelegram = null;
            
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Alarm Rule was added"
            });

            this.$store.dispatch("getDevices");

            return;
          }
        }).then(
            setTimeout(() => {
              this.isButtonEnabled = false;
            }, 1500)
        )
        .catch(e => {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error"
          });
          console.log(e);
          return;
        });
    }
  }
};
</script>
