import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';


const httpLink = new HttpLink({
  uri: "https://prrwjjssnvhpbcdwbcwx3nm3zm.appsync-api.ap-southeast-2.amazonaws.com/graphql",
  headers: {
    'x-api-key': "da2-d46dkkw5xnfbxkxkhi6twfb7re",
  },
});

const client = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
});

export default client;
