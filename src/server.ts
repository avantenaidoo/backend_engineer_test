import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      console.error('GraphQL Error:', err);
      return {
        message: err.message,
        extensions: {
          code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
          stacktrace: err.stack?.split('\n'),
        },
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app: app as any }); 

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});