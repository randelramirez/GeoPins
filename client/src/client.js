import { GraphQLClient } from 'graphql-request';

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '<prod-url>'
    : 'http://localhost:4000/graphql';

export const useClient = () => {
  return new GraphQLClient(BASE_URL, {
    headers: {
      authorization: window.gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse().id_token,
    },
  });
};
