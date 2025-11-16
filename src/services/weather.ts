import axios from 'axios';
import { ActivityName } from '../graphql/schema.js';

export const getForecast = async (lat: number, lng: number, days: number = 7) => {
  const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lng,
      daily: 'temperature_2m_max,precipitation_sum,snowfall_sum',
      forecast_days: days,
      timezone: 'auto',
    },
  });
  const d = data.daily;
  return {
    daily: d.time.map((date: string, i: number) => ({
      date,
      tempMax: d.temperature_2m_max[i],
      precipitationSum: d.precipitation_sum[i],
      snowfallSum: d.snowfall_sum[i],
    })),
  };
};

export const rankActivities = (forecast: any): Array<{ name: keyof typeof ActivityName; rank: number; suitabilityScore: number }> => {
  const days = forecast.daily;
  const avg = (key: 'tempMax' | 'precipitationSum' | 'snowfallSum') =>
    days.reduce((s: number, d: any) => s + d[key], 0) / days.length;
  const totalSnow = days.reduce((s: number, d: any) => s + d.snowfallSum, 0);

  const tempAvg = avg('tempMax');
  const precipAvg = avg('precipitationSum');

  const scores: Record<string, number> = {
    SKIING: Math.min(1, (totalSnow > 0 ? 0.7 : 0) + (tempAvg < 5 ? 0.3 : 0) - (precipAvg > 3 ? 0.2 : 0)),
    SURFING: Math.min(1, (tempAvg > 20 ? 0.7 : 0) + (precipAvg < 2 ? 0.3 : 0) - (tempAvg < 15 ? 0.4 : 0)),
    INDOOR_SIGHTSEEING: Math.min(1, (precipAvg > 5 || tempAvg > 30 || tempAvg < 10 ? 0.9 : 0.5)),
    OUTDOOR_SIGHTSEEING: Math.min(1, (tempAvg > 15 && tempAvg < 28 ? 0.8 : 0.4) - (precipAvg > 2 ? 0.5 : 0)),
  };

  const max = Math.max(...Object.values(scores));
  return Object.entries(scores)
    .map(([name, score]) => ({ name: name as keyof typeof ActivityName, suitabilityScore: max ? score / max : 0, rank: 0 }))
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .map((a, i) => ({ ...a, rank: i + 1 }));
};