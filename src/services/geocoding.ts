import axios from 'axios';

export const getCitySuggestions = async (name: string) => {
  const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
    params: { name, count: 5, language: 'en' },
  });
  return (data.results || []).map((r: any) => ({
    name: r.name,
    country: r.country,
    lat: r.latitude,
    lng: r.longitude,
  }));
};