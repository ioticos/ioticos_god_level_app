<template>
    <div>
        <CityInfoDetail
            class="ww-city-info__info"
            :forecast="forecast"
            @change-view="$emit('change-view')" />
    </div>

</template>
  
<script>
import CityInfoDetail from './components/CityInfoDetail/CityInfoDetail.vue';
export default {
    name: 'WeatherPage',
    middleware: "authenticated",
    components: {
        CityInfoDetail,
    },
    data() {
        return {
            forecast: {}
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
            } catch (error) {
                console.error(error)
            }
        },
    },
};
</script>

<style lang="scss" scoped>
$font-size: 16px;
$font-family: 'Montserrat', sans-serif !important;

$color-primary: #6091e6;
$color-black: #232323;
$color-white: #fff;
$color-grey:#f6f6f8;
$color-bg-app:#f5f8fd;
$color-icon:#7b7b7b;
$color-placeholder:#c4c4d8;

$color-bg-active-list-item: #9abaf2;

$color-bg-info-detail-dark: #90b2ee;
$color-bg-info-detail-light: #b6cffb;
 .city-info-detail {
    background: $color-bg-info-detail-dark;
    background: linear-gradient(90deg, $color-bg-info-detail-dark, $color-bg-info-detail-light);
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 1.25rem;
    position: relative;
    width: 100%;
 }
.change-view {
        align-items: center;
        color: $color-white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        position: absolute;
        right: 1.25rem;
        top: 1.25rem;
        transition: color 100ms ease-in;
        z-index: 1;

        &:hover {
            color: $color-primary;
        }
    }

     .date {
        color: $color-white;
        font-size: 0.75rem;
        margin-bottom: 0.5rem;
        width: 100%;
    }

     .city {
        color: $color-white;
        font-size: 1.25rem;
        margin-bottom: 1rem;
        width: 100%;
    }

     .temperature {
        color: $color-white;
        font-size: 4rem;
        width: 100%;

        b {
            position: relative;
        }

        span {
            font-size: 0.9rem;
            position: absolute;
            right: 0;
            top: 4px;
            transform: translateX(100%);
        }
    }

     .description {
        color: $color-white;
        font-size: 1rem;
        text-transform: lowercase;
        width: 100%;

        &::first-letter {
            text-transform: uppercase;
        }
    }

     .icon {
        display: inline-flex;
        position: absolute;
        right: 1.25rem;
        top: 50%;
        transform: translateY(-50%);
        width: auto;

        &>* {
            width: 8rem !important;
        }
    }
</style>