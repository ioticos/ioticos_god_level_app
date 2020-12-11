<template>
  <card>
    <div slot="header">
      <h4 class="card-title">{{config.selectedDevice.name}} - {{config.variableFullName}} </h4>
    </div>

    <i class="fa " :class="[config.icon]"></i>

  </card>
</template>

<script>
export default {
  //props: ['config'],
  data() {
    return {
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
        class: "danger"
      }
    };
  }
};

//userId/dId/uniquestr/sdata
</script>
