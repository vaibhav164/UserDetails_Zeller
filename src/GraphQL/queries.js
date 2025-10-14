import { gql } from '@apollo/client';

export const LIST_ZELLER_CUSTOMERS = gql`
  query listZellerCustomers {
    listZellerCustomers {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`;
