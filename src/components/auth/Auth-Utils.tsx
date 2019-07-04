import { UserAgentApplication, AuthResponse } from 'msal';
import { acquireToken } from 'src/actions/userActions';
import Axios, { AxiosRequestConfig } from 'axios';

export const adalFetch = (
  authContext: UserAgentApplication,
  resource: any,
  axios: any,
  url: string,
  options: AxiosRequestConfig
) => {
  return acquireToken({
    scopes: [`${process.env.REACT_APP_AAD_CLIENT_ID}`]
  }).then((tokenResponse: AuthResponse) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${tokenResponse.accessToken}`
    };
    const axiosOptions = { ...options, headers };
    return Axios(url, axiosOptions);
  });
};
