import React from 'react';
import client from './src/GraphQL/ApolloClient';
import { ApolloProvider } from '@apollo/client/react';
import RootNavigator from './src/Navigation/Navigator';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
export default function App() {
  return (
    <ApolloProvider client={client}>
      <RootNavigator />
    </ApolloProvider>
  );
}