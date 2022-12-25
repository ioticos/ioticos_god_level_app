<template>
    <div>
        <CityInfoDetail class="ww-city-info__info" :forecast="forecast" />
        <CityInfoMain class="ww-city-info__props" :info="mainInfo" />
    </div>

</template>
  
<script>
import CityInfoDetail from './components/CityInfoDetail/CityInfoDetail.vue';
import CityInfoMain from './components/CityInfoDetail/CityInfoMain.vue';
export default {
    name: 'WeatherPage',
    middleware: "authenticated",
    components: {
        CityInfoDetail,
        CityInfoMain,
    },
    data() {
        return {
            mainInfo: [],
            forecast: {
                main: { temp: 0 }
            }
        };
    },
    mounted() {
        this.searchWeather();
    },
    methods: {
        async searchWeather() {
            const weatherClient = this.$axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/',
                timeout: 2000,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            weatherClient.interceptors.request.use((config) => {
                config.params = config.params || {}
                config.params.appid = process.env.weather_api_key
                return config
            })
            try {
                const { data } = await weatherClient.get(`/weather`, {
                    params: {
                        lat: 10.5060934,
                        lon: -66.9146008,
                        units: 'metric'
                    }
                })
                console.log(data)
                this.forecast = data;
                const cloudiness = `${this.forecast.cloudiness}%`
            const humidity = `${this.forecast.humidity}%`
            const windSpeed = `${this.forecast.windSpeed}m/s`
            const pressure = `${this.forecast.pressure}hPa`
            this.mainInfo = [
                {
                    value: cloudiness,
                    icon: 'cloud'
                },
                {
                    value: humidity,
                    icon: 'droplet'
                },
                {
                    value: windSpeed,
                    icon: 'wind'
                },
                {
                    value: pressure,
                    icon: 'clock'
                }
            ]
            } catch (error) {
                console.error(error)
            }
        },
    },
};
</script>