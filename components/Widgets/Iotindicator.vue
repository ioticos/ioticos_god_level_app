<template>
  <card>
    <div slot="header">
      <h4 class="card-title">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h4>
    </div>

    <i
      class="fa "
      :class="[config.icon, getIconColorClass()]"
      style="font-size: 30px"
    ></i>
  </card>
</template>

<script>
export default {
  //props: ['config'],
  data() {
    return {
      value: TextTrackCueList,
      config: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
          templateName: "Power Sensor",
          templateId: "984237562348756ldksjfh",
          saverRule: false
        },
        variableFullName: "Pump",
        variable: "uniquestr",
        icon: "fa-sun",
        column: "col-6",
        widget: "indicator",
        class: "success"
      }
    };
  },
  mounted(){
    this.$nuxt.$on('widget-topic', this.processReceivedData)
  },
  methods: {

    processReceivedData(data){
        console.log("received");
        console.log(data);
        this.value = data.value;
    },
      
    getIconColorClass() {
      if (!this.value) {
        return "text-dark";
      }

      if (this.config.class == "success") {
        return "text-success";
      }
      if (this.config.class == "primary") {
        return "text-primary";
      }
      if (this.config.class == "warning") {
        return "text-warning";
      }
      if (this.config.class == "danger") {
        return "text-danger";
      }
    }

  }
};

//userId/dId/uniquestr/sdata
</script>
