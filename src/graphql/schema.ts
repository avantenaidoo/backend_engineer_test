import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    citySuggestions(name: String!): [City!]!
    weatherForecast(lat: Float!, lng: Float!, days: Int = 7): WeatherForecast!
    rankedActivities(lat: Float!, lng: Float!, days: Int = 7): [Activity!]!
  }

  type City { name: String! country: String! lat: Float! lng: Float! }
  type DailyWeather { date: String! tempMax: Float! precipitationSum: Float! snowfallSum: Float! }
  type WeatherForecast { daily: [DailyWeather!]! }
  type Activity { name: ActivityName! rank: Int! suitabilityScore: Float! }

  enum ActivityName { SKIING SURFING INDOOR_SIGHTSEEING OUTDOOR_SIGHTSEEING }
`;

export enum ActivityName {
  SKIING = 'SKIING',
  SURFING = 'SURFING',
  INDOOR_SIGHTSEEING = 'INDOOR_SIGHTSEEING',
  OUTDOOR_SIGHTSEEING = 'OUTDOOR_SIGHTSEEING',
}