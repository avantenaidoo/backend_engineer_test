import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    citySuggestions(name: String!): [City!]!
    weatherForecast(latitude: Float!, longitude: Float!, days: Int = 7): WeatherForecast!
    rankedActivities(latitude: Float!, longitude: Float!, days: Int = 7): [RankedDay!]!
  }

  type City {
    name: String!
    country: String!
    admin1: String
    lat: Float!
    lng: Float!
  }

  type DailyWeather {
    date: String!
    temperatureMax: Float!
    temperatureMin: Float!
    precipitation: Float!
    windSpeed: Float!
    snow: Float!
  }

  type WeatherForecast {
    daily: [DailyWeather!]!
  }

  type Activity {
    name: String!
    rank: Int!
    suitabilityScore: Float!
  }

  type RankedDay {
    date: String!
    activities: [Activity!]!
  }
`;