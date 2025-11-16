import { getCitySuggestions } from '../services/geocoding.js';
import { getForecast, rankActivities } from '../services/weather.js';

export const resolvers = {
  Query: {
    citySuggestions: async (_: any, { name }: { name: string }) => getCitySuggestions(name),
    weatherForecast: async (_: any, { lat, lng, days }: { lat: number; lng: number; days: number }) => getForecast(lat, lng, days),
    rankedActivities: async (_: any, { lat, lng, days }: { lat: number; lng: number; days: number }) => {
      const forecast = await getForecast(lat, lng, days);
      return rankActivities(forecast);
    },
  },
};