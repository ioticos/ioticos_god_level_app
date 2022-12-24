<template>
    <div class="ww-city-info-detail">
      <div
        class="ww-city-info-detail__change-view"
        @click="$emit('change-view')">
        <AppIcon
          size="1.5rem"
          name="list" />
      </div>
  
      <!-- city -->
      <div class="ww-city-info-detail__city">
        <b>{{ forecast.name }}</b>,
      </div>
  
      <!-- temperature -->
      <div class="ww-city-info-detail__temperature">
        <b>
          {{ forecast.main }}
          <span>&deg;C</span>
        </b>
      </div>
  
      <!-- description -->
      <div
        v-if="forecast.weather"
        class="ww-city-info-detail__description">
        {{ forecast.weather }}
      </div>
    </div>
  </template>

<script>

export default {
  name: 'CityInfoDetail',
  props: {
    forecast: {
      type: Object,
      required: true
    }
  },
  components: {
  },
  data() {
    return {
      // Aquí puedes declarar tus propiedades de data y métodos
    }
  },
  computed: {
    // Aquí puedes declarar tus propiedades computadas
  },
  mounted() {
    // Aquí puedes colocar el código que se ejecutará cuando el componente haya sido montado
  },
  methods: {
    // Aquí puedes declarar tus métodos
  }
}
</script>