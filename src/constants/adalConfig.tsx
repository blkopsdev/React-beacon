import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

export const adalConfig = {
  tenant: 'c4c919d8-b946-48a3-a1c3-eb12b3e1f83b',
  clientId: 'fd71f683-7423-4ba0-9ed3-fba0547be076',
  endpoints: {
    api: 'c4c919d8-b946-48a3-a1c3-eb12b3e1f83b'
  },
  cacheLocation: 'localStorage',
  redirectUri: 'http://localhost:3000'
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch: any, url: any, options: any) =>
  adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);

export const withAdalLoginApi = withAdalLogin(
  authContext,
  adalConfig.endpoints.api
);
