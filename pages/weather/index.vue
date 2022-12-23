<template>
    <div>
        <form @submit.prevent="searchWeather">
            <label for="location">Ingresa tu ubicación:</label>
            <input type="text" v-model="location" id="location" placeholder="e.g. Ciudad de México" />
            <button type="submit">Buscar</button>
        </form>
        <div v-if="temperature && humidity">
            <p>Temperatura actual: {{ temperature }}</p>
            <p>Humedad: {{ humidity }}</p>
        </div>
    </div>
    
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    middleware: "authenticated",
    data() {
      return {
        location: '',
        temperature: '',
        humidity: '',
      };
    },
    methods: {
      async searchWeather() {
        try {
          // Realizamos una solicitud a la API de Geocoding para obtener la latitud y longitud de la ubicación especificada
          const GEOCODING_API_KEY = process.env.weather_api_key;
          console.log(process.env.weather_api_key)
          
          const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${this.location}&limit=1&appid=${GEOCODING_API_KEY}`);
          console.log(response)
          const locationData = response.data;
          // Si se encontró una ubicación, utilizamos sus coordenadas para realizar una solicitud a la API de Open Weather y obtener el pronóstico del tiempo actual
          if (response.status == 200) {
            const WEATHER_API_KEY = process.env.weather_api_key;
            const lat = locationData.lat;
            const lon = locationData.lon;
            const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`);
            const weatherData = weatherResponse.data;
            console.log(weatherData)
            this.temperature = weatherData.main.temp;
            this.humidity = weatherData.main.humidity;
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>