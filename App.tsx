import React from 'react';
import client from './src/GraphQL/ApolloClient';
import { ApolloProvider } from '@apollo/client/react';
import CustomerList from './src/Components/CustomerList';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <CustomerList />
    </ApolloProvider>
  );
}