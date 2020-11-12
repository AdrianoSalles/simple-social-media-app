import React from 'react';
import App from './App';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';

const link = createHttpLink({ uri: 'http://localhost:5000' });
const cache = new InMemoryCache();
const client = new ApolloClient({ link, cache });

const provider = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default provider;
