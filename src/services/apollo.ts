import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: process.env.HYGRAPH_CONTENT_URL,
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_ACCESS_TOKEN}`,
  },
  cache: new InMemoryCache(),
});
