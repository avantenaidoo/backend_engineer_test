import axios from 'axios';
import { ActivityName, type Activity } from '../types/sharedTypes.js';
import { ApiError } from '../errors/customErrors.js';

interface DailyWeather {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  windSpeed: number;
  snow: number;
}

interface WeatherForecast {
  daily: DailyWeather[];
}

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export const getWeatherForecast = async (latitude: number, longitude: number, days: number = 7): Promise<WeatherForecast> => {
  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        latitude,
        longitude,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,snowfall_sum',
        timezone: 'auto',
        forecast_days: days,
      },
    });
    const daily = response.data.daily;
    return {
      daily: daily.time.map((date: string, index: number) => ({
        date,
        temperatureMax: daily.temperature_2m_max[index],
        temperatureMin: daily.temperature_2m_min[index],
        precipitation: daily.precipitation_sum[index],
        windSpeed: daily.wind_speed_10m_max[index],
        snow: daily.snowfall_sum[index],
      })),
    };
  } catch (error) {
    throw new ApiError(`Weather API error: ${(error as Error).message}`);
  }
};

export const rankActivities = (weather: WeatherForecast): Activity[][] => {
  // Per-day ranking for better scalability and accuracy
  return weather.daily.map((day) => {
    const scores: Record<ActivityName, number> = {
      [ActivityName.SKIING]: (day.snow > 0 ? 0.8 : 0) + (day.temperatureMax < 0 ? 0.2 : 0) - (day.precipitation > 5 ? 0.3 : 0) - (day.windSpeed > 20 ? 0.1 : 0),
      [ActivityName.SURFING]: (day.windSpeed > 10 && day.windSpeed < 30 ? 0.7 : 0) + (day.temperatureMax > 20 ? 0.3 : 0) - (day.precipitation > 5 ? 0.4 : 0),
      [ActivityName.INDOOR_SIGHTSEEING]: (day.precipitation > 5 || day.temperatureMax < 10 || day.temperatureMax > 30 ? 0.9 : 0.5) - (day.windSpeed > 20 ? 0.2 : 0),
      [ActivityName.OUTDOOR_SIGHTSEEING]: (day.temperatureMax > 10 && day.temperatureMax < 30 ? 0.8 : 0.4) - (day.precipitation > 2 ? 0.5 : 0) - (day.windSpeed > 15 ? 0.3 : 0),
    };

    const maxScore = Math.max(...Object.values(scores));
    return Object.entries(scores)
      .map(([name, score]) => ({ name: name as ActivityName, suitabilityScore: maxScore > 0 ? score / maxScore : 0 }))
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
      .map((a, index) => ({ ...a, rank: index + 1 }));
  });
};