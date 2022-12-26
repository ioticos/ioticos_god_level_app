import axios from 'axios';

const IP_CACHE = "vww__cache_ip";
const IP_LOCATION_CACHE = "vww__cache_ip_location";
const GEOCODE_CACHE = "vww__cache_geocode";

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
  uk: "metric",
};

const utils = {
  lookupIP: () => {
    let cache = localStorage[IP_CACHE] || "{}";
    cache = JSON.parse(cache);
    if (cache.ip) {
      return Promise.resolve(cache);
    }

    return fetch("https://www.cloudflare.com/cdn-cgi/trace")
      .then((resp) => resp.text())
      .then((text) => {
        return text
          .split("\n")
          .map((l) => l.split("="))
          .filter((x) => x.length == 2)
          .reduce((o, x) => {
            o[x[0].trim()] = x[1].trim();
            return o;
          }, {});
      })
      .then((data) => {
        localStorage[IP_CACHE] = JSON.stringify(data);
        return data;
      });
  },

  fetchLocationByIP: (apiKey, ip) => {
    if (!ip) {
      return utils.lookupIP().then((data) => {
        return utils.fetchLocationByIP(apiKey, data["ip"]);
      });
    }

    let cache = localStorage[IP_LOCATION_CACHE] || "{}";
    cache = JSON.parse(cache);
    if (cache[ip]) {
      return cache[ip];
    }

    apiKey = apiKey || "f8n4kqe8pv4kii";
    return fetch(`https://api.ipregistry.co/${ip}?key=${apiKey}`)
      .then((resp) => resp.json())
      .then((result) => {
        cache[ip] = result.location || {};
        localStorage[IP_LOCATION_CACHE] = JSON.stringify(cache);
        return cache[ip];
      });
    // latitude, longitude, city, country.name
  },

  geocode: (apiKey, query, reversed = false) => {
    let cache = localStorage[GEOCODE_CACHE] || "{}";
    cache = JSON.parse(cache);
    if (cache[query]) {
      return Promise.resolve(cache[query]);
    }

    apiKey = apiKey || "c3bb8aa0a56b21122dea6a2a8ada70c8";
    const apiType = reversed ? "reverse" : "forward";
    return fetch(`//api.positionstack.com/v1/${apiType}?access_key=${apiKey}&query=${query}`)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.error) {
          throw new Error("(api.positionstack.com) " + result.error.message);
        }
        cache[query] = result.data[0];
        localStorage[GEOCODE_CACHE] = JSON.stringify(cache);
        return cache[query];
      });
    // latitude, longitude, region, country
  },

  reverseGeocode: (apiKey, lat, lng) => {
    return utils.geocode(apiKey, `${lat},${lng}`, true);
  },
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
