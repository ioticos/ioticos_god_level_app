import axios from 'axios';

const ICON_MAPPINGS = {
  "clear-day": ["01d"],
  "clear-night": ["01n"],
  cloudy: ["03d", "03n"],
  fog: ["50d", "50n"],
  "partly-cloudy-day": ["02d", "04d"],
  "partly-cloudy-night": ["02n", "04n"],
  rain: ["09d", "09n", "10d", "10n", "11d", "11n"],
  sleet: ["13d", "13n"],
  snow: ["13d", "13n"],
  wind: ["50d", "50n"],
};

const UNIT_MAPPINGS = {
  auto: "standard",
  us: "imperial",
  metric: "metric",
};

const utils = {
  fetchOWMWeather: async (opts = {}) => {
    opts.units = opts.units || "auto";
    opts.language = opts.language || "en";
    if (!opts.lat || !opts.lng) {
      throw new Error("Geolocation is required");
    }
  
    const units = UNIT_MAPPINGS[opts.units] || "standard";
  
    const params = {
      appid: opts.apiKey,
      lat: opts.lat,
      lon: opts.lng,
      units: units,
      lang: opts.language,
    };
  
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/onecall', { params });
      return utils.mapData(response.data);
    } catch (error) {
      throw new Error(error);
    }
  },
  geoCoding: async (opts = {}) => {

    const API_GEOCODING_ENDPOINT = 'https://api.openweathermap.org/geo/1.0/'
        try {
          if(opts.location != ''){
          const { data } = await axios.get(`${API_GEOCODING_ENDPOINT}direct`, {
            params: {
              q: opts.location,
              appid: opts.apiKey,
              limit: 5
            }
          })
          return data
        }
        } catch (error) {
          console.error(error)
        }
    },
  mapData: (data) => {
    const { current } = data;
    const { weather } = current;
    const [currentWeather] = weather;
    const { description, icon } = currentWeather;
    const iconName = utils.mapIcon(icon);

    return {
      currently: Object.assign({}, current, {
        icon: iconName,
        temperature: current.temp,
        summary: description,
        windSpeed: current.wind_speed,
        windBearing: current.wind_deg,
      }),
      daily: {
        data: data.daily.map((day) => {
          return {
            temperatureMax: day.temp.max,
            temperatureMin: day.temp.min,
            time: day.dt,
            icon: utils.mapIcon(day.weather[0].icon),
          };
        }),
      },
      hourly: {
        data: data.hourly.map((hour) => {
          return {
            temperature: hour.temp,
          };
        }),
      },
    };
  },

  mapIcon: (code) => {
    return Object.keys(ICON_MAPPINGS).find((key) => {
      return ICON_MAPPINGS[key].includes(code);
    });
  },
};

export default utils;
