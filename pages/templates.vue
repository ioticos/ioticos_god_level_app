<template>
  <div class="row">
    <div class="col-4">
      <Iotindicator :config="config1"></Iotindicator>
    </div>
    <div class="col-4">
      <Iotindicator :config="config2"></Iotindicator>
    </div>
    <div class="col-4">
      <Iotindicator :config="config3"></Iotindicator>
    </div>
    <br><br>
    <div style="margin-top: 200px;">
        <button @click="sendData1()">SEND userid/8888/var1/sdata</button>
        <button @click="sendData2()">SEND userid/8888/var2/sdata</button>
        <button @click="sendData3()">SEND userid/8888/var3/sdata</button>

        
    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
      value: false,

      config1: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
          templateName: "Power Sensor",
          templateId: "984237562348756ldksjfh",
          saverRule: false
        },
        variableFullName: "Pump",
        variable: "var1",
        icon: "fa-sun",
        column: "col-6",
        widget: "indicator",
        class: "success"
      },

      config2: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
          templateName: "Power Sensor",
          templateId: "984237562348756ldksjfh",
          saverRule: false
        },
        variableFullName: "Light",
        variable: "var2",
        icon: "fa-sun",
        column: "col-6",
        widget: "indicator",
        class: "success"
      },
      config3: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
          templateName: "Power Sensor",
          templateId: "984237562348756ldksjfh",
          saverRule: false
        },
        variableFullName: "Engine",
        variable: "var3",
        icon: "fa-sun",
        column: "col-6",
        widget: "indicator",
        class: "success"
      }
    };
  },

  methods: {

    sendData1() {
      this.value = !this.value;
      const toSend = {
        value: this.value
      };
      this.$nuxt.$emit("userid/8888/var1/sdata", toSend);
    },
    sendData2() {
      this.value = !this.value;
      const toSend = {
        value: this.value
      };
      this.$nuxt.$emit("userid/8888/var2/sdata", toSend);
    },
    sendData3() {
      this.value = !this.value;
      const toSend = {
        value: this.value
      };
      this.$nuxt.$emit("userid/8888/var3/sdata", toSend);
    },

  }
};
</script>
