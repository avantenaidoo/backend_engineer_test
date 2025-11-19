import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      if (err instanceof GraphQLError) {
        return err; // Custom errors
      }
      console.error(err); // Log internal errors
      return new GraphQLError('Internal server error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    },
  });

  await server.start();
  server.applyMiddleware({ app: app as any });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();