import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

export const adalConfig = {
  tenant: 'c4c919d8-b946-48a3-a1c3-eb12b3e1f83b',
  clientId: '9eced824-e4db-436e-ad99-82391d4b9f25',
  endpoints: {
    api: '9eced824-e4db-436e-ad99-82391d4b9f25'
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
