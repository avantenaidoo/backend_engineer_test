import request from 'supertest';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from '../src/graphql/schema.js';
import { resolvers } from '../src/graphql/resolvers.js';

let app: express.Application;
let server: ApolloServer;

beforeAll(async () => {
  app = express();

  server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app: app as any });
});

const gql = (query: string, vars = {}) =>
  request(app).post('/graphql').send({ query, variables: vars });

describe('API', () => {
  it('citySuggestions', async () => {
    const res = await gql(`query { citySuggestions(name: "Cape") { name } }`);
    expect(res.body.data.citySuggestions.length).toBeGreaterThan(0);
  });

  it('weatherForecast', async () => {
    const res = await gql(`
      query {
        weatherForecast(latitude: -33.92, longitude: 18.42, days: 1) {
          daily {
            temperatureMax
          }
        }
      }
    `);
    expect(res.body.data.weatherForecast.daily).toHaveLength(1);
  });

  it('rankedActivities', async () => {
    const res = await gql(`
      query {
        rankedActivities(latitude: -33.92, longitude: 18.42, days: 1) {
          date
          activities {
            rank
          }
        }
      }
    `);
    expect(res.body.data.rankedActivities[0].activities).toHaveLength(4);
  });
});