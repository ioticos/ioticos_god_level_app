// A simple Widget create by Sudipto Chandra
// Original Widget on
// https://github.com/dipu-bd/vue-weather-widget.git

import Utils from "./utils";
import { v4 as uuid } from "uuid";
import Skycon from "vue-skycons";
import CitiesListItem from "./CitiesListItem";

export default {
  middleware: "authenticated",
  name: "VueWeatherWidget",

  components: {
    Skycon,
    CitiesListItem
  },

  props: {
    // OpenWeatherMap secret key
    apiKey: {
      type: String,
      default: process.env.weather_api_key
    },

    // Return summary properties in the desired language.
    language: {
      type: String,
      default: "es"
    },

    // Return weather conditions in the requested units.
    units: {
      type: String,
      default: "metric"
    },

    // Controls whether to show or hide the title bar.
    hideHeader: {
      type: Boolean,
      default: false
    },

    // Auto update interval in milliseconds
    updateInterval: {
      type: Number
    },

    // Use static skycons
    disableAnimation: {
      type: Boolean,
      default: false
    },

    // Color of the Temparature bar. Default: '#444'
    barColor: {
      type: String,
      default: "#444"
    },

    // Color of the text. Default: '#f4f5f7'
    textColor: {
      type: String,
      default: "#f4f5f7"
    }
  },

  data() {
    return {
      loading: true,
      weather: null,
      error: null,
      timeout: null,
      location: null,
      locations: [],
      searchTimeout: null,
      latitude: {
        type: String,
        default: "-12.0431800"
      },
      // The longitude of a location (in decimal degrees).
      // Positive is east, negative is west.
      longitude: {
        type: String,
        default: "-77.0282400"
      }
    };
  },

  watch: {
    location: function(newValue) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.search(), 1000);
    },
    apiKey: "hydrate",
    latitude: "hydrate",
    longitude: "hydrate",
    language: "hydrate",
    units: "hydrate",
    updateInterval: "hydrate"
  },

  mounted() {
    this.hydrate();
  },

  destroyed() {
    clearTimeout(this.timeout);
  },

  computed: {
    currently() {
      return this.weather.currently;
    },
    isDownward() {
      const hourly = this.weather.hourly.data;
      const time = new Date().getTime() / 1e3;
      for (let i = 0; i < hourly.length; i++) {
        if (hourly[i].time <= time) continue;
        return hourly[i].temperature < this.currently.temperature;
      }
    },
    windBearing() {
      const t = Math.round(this.currently.windBearing / 45);
      return ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"][t];
    },
    daily() {
      const forecasts = [];
      let globalMaxTemp = -Infinity;
      let globalMinTemp = Infinity;

      const tomorrow = new Date(new Date().toDateString());
      const today = tomorrow.getTime() / 1e3 + 24 * 3600 - 1;

      const daily = this.weather.daily.data;
      for (let i = 0; i < daily.length; i++) {
        const day = daily[i];
        if (day.temperatureMax > globalMaxTemp) {
          globalMaxTemp = day.temperatureMax;
        }
        if (day.temperatureMin < globalMinTemp) {
          globalMinTemp = day.temperatureMin;
        }
        forecasts.push(Object.assign({}, day));
      }

      const tempRange = globalMaxTemp - globalMinTemp;
      for (let i = 0; i < forecasts.length; ++i) {
        const day = forecasts[i];
        if (day.time <= today) {
          day.weekName = "Today";
        } else {
          day.weekName = new Date(day.time * 1000).toLocaleDateString(
            this.language,
            {
              weekday: "short"
            }
          );
        }
        const max = day.temperatureMax;
        const min = day.temperatureMin;
        day.height = Math.round((100 * (max - min)) / tempRange);
        day.top = Math.round((100 * (globalMaxTemp - max)) / tempRange);
        day.bottom = 100 - (day.top + day.height);
      }
      return forecasts;
    }
  },

  methods: {
    sendValue() {
      const toSend = {
          topic: "weather"+"/actdata",
          msg: {
              value: this.weather.currently.weather
          }
        };
          
          console.log(toSend);
          this.$nuxt.$emit('mqtt-sender', toSend);
  },
    selectedLocation(location){
      this.location = location.name;
      this.locations = [];
      this.longitude = String(location.lon);
      this.latitude = String(location.lat);
    },
    loadWeather() {
      const fetchWeatherMethod = Utils.fetchOWMWeather;
      return fetchWeatherMethod({
        apiKey: this.apiKey,
        lat: this.latitude,
        lng: this.longitude,
        units: this.units,
        language: this.language
      }).then(data => {
        this.$set(this, "weather", data);
      });
    },
    async search() {
      this.locations = [];
      const geocode = Utils.geoCoding;
      console.log(this.location);
      const data = await geocode({
        location: this.location,
        apiKey: this.apiKey
      });

      this.locations = data.map(location => ({
        id: uuid(),
        ...location
      }));
    },

    autoupdate() {
      clearTimeout(this.timeout);
      const time = Number(this.updateInterval);
      if (!time || time < 10 || this.destroyed) {
        return;
      }
      this.timeout = setTimeout(() => this.hydrate(false), time);
    },

    hydrate(setLoading = true) {
      this.$set(this, "loading", setLoading);
      return this.$nextTick()
        .then(this.processLocation)
        .then(this.loadWeather)
        .then(this.sendValue)
        .then(() => {
          this.$set(this, "error", null);
        })
        .catch(err => {
          this.$set(this, "error", "" + err);
        })
        .finally(() => {
          this.$set(this, "loading", false);
          this.autoupdate();
        });
    },

    processLocation() {
      if (!this.latitude || !this.longitude) {
        throw new Error("VueWeatherWidget: Latitude or longitude is required");
      }
    }
  }
};
