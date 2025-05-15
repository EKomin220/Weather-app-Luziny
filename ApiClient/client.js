import { fetchWeatherApi } from 'openmeteo';

const url = "https://api.open-meteo.com/v1/forecast";

export default class WeatherApiClient {

  constructor() {
    this.cities = [{ name: "Praha", latitude: 50.041456, longitude: 14.32419 }];
  }

  async getPragueWeather(index = 0) {
    try {
      const city = this.cities[index];
      const params = {
        "latitude": city.latitude,
        "longitude": city.longitude,
        "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "wind_speed_10m_max", "precipitation_sum", "precipitation_probability_max"],
        "timezone": "Europe/Berlin"
      };

      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];

      // Get required attributes
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const timezone = response.timezone();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      const latitude = response.latitude();
      const longitude = response.longitude();

      const daily = response.daily();

      const weatherData = {
        city: city.name,
        coordinates: {
          latitude: latitude,
          longitude: longitude
        },
        timezone: {
          name: timezone,
          abbreviation: timezoneAbbreviation,
          utcOffset: utcOffsetSeconds
        },
        daily: {
          time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
            (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
          ),
          weatherCode: daily.variables(0).valuesArray(),
          temperature2mMax: daily.variables(1).valuesArray(),
          temperature2mMin: daily.variables(2).valuesArray(),
          windSpeed10mMax: daily.variables(3).valuesArray(),
          precipitationSum: daily.variables(4).valuesArray(),
          precipitationProbabilityMax: daily.variables(5).valuesArray(),
        }
      };

      return weatherData;
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }
}






