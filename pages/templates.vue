<template>

  <div class="row">
   
    <Iotbutton :config="configButton"></Iotbutton>

    <Iotindicator :config="configIndicator"></Iotindicator>


    <button @click="sendData1()">SEND</button>

  </div>
</template>

<script>
export default {
  data() {
    return {
      value: false,

      

      configButton:{
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
        class: "danger",
        message: "{'fanstatus': 'stop'}"
      },

      configIndicator: {
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


  }
};
</script>
