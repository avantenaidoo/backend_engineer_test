// src/graphql/resolvers.ts
import { citySuggestions } from '../services/geocoding.js';
import { getWeatherForecast, rankActivities } from '../services/weather.js';
import { ValidationError } from '../errors/customErrors.js';

export const resolvers = {
  Query: {
    citySuggestions: async (_: any, { name }: { name: string }) => {
      if (!name?.trim()) {
        throw new ValidationError('City name is required');
      }
      return citySuggestions(name);
    },

    weatherForecast: async (_: any, { latitude, longitude, days }: { latitude: number; longitude: number; days?: number }) => {
      if (latitude == null || longitude == null) {
        throw new ValidationError('Latitude and longitude are required');
      }
      return getWeatherForecast(latitude, longitude, days);
    },

    rankedActivities: async (_: any, { latitude, longitude, days }: { latitude: number; longitude: number; days?: number }) => {
      if (latitude == null || longitude == null) {
        throw new ValidationError('Latitude and longitude are required');
      }
      const forecast = await getWeatherForecast(latitude, longitude, days);
      const ranked = rankActivities(forecast);

      return forecast.daily.map((day, index) => ({
        date: day.date,
        activities: ranked[index],
      }));
    },
  },
};