import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

async function start() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app: app as any });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}${server.graphqlPath}`);
  });
}

start();