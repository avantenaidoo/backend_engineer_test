import { citySuggestions } from '../services/geocoding.js';
import { getWeatherForecast, rankActivities } from '../services/weather.js';
import { ValidationError } from '../errors/customErrors.js';

export const resolvers = {
  Query: {
    citySuggestions: async (_: any, { name }: { name: string }) => {
      if (!name.trim()) throw new ValidationError('Name cannot be empty');
      return citySuggestions(name);
    },
    weatherForecast: async (_: any, { latitude, longitude, days }: { latitude: number; longitude: number; days: number }) => {
      if (isNaN(latitude) || isNaN(longitude)) throw new ValidationError('Invalid latitude or longitude');
      return getWeatherForecast(latitude, longitude, days);
    },
    rankedActivities: async (_: any, { latitude, longitude, days }: { latitude: number; longitude: number; days: number }) => {
      if (isNaN(latitude) || isNaN(longitude)) throw new ValidationError('Invalid latitude or longitude');
      const weather = await getWeatherForecast(latitude, longitude, days);
      const ranked = rankActivities(weather);
      return weather.daily.map((day, index) => ({ date: day.date, activities: ranked[index] }));
    },
  },
};