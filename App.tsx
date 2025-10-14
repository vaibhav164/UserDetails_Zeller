import React from 'react';
import client from './src/GraphQL/ApolloClient';
import { ApolloProvider } from '@apollo/client/react';
import HomeScreen from './src/Screens/HomeScreen/HomeScreen';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
export default function App() {
  return (
    <ApolloProvider client={client}>
      <HomeScreen />
    </ApolloProvider>
  );
}