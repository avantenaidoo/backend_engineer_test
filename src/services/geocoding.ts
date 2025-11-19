import axios from 'axios';
import { ApiError, NotFoundError } from '../errors/customErrors.js';

export const citySuggestions = async (name: string): Promise<any[]> => {
  try {
    const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name, count: 10, language: 'en', format: 'json' },
    });

    if (!data.results || data.results.length === 0) {
      throw new NotFoundError('No cities found for the given name');
    }

    return data.results.map((c: any, i: number) => ({
      id: `${c.latitude}-${c.longitude}-${i}`,
      name: c.name,
      country: c.country,
      admin1: c.admin1 || null,
      lat: c.latitude,
      lng: c.longitude,
    }));
  } catch (error) {
    throw new ApiError(`Geocoding API error: ${(error as Error).message}`);
  }
};