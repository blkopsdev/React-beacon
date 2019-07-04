import { UserAgentApplication } from 'msal';
import { acquireToken } from 'src/actions/userActions';
import Axios from 'axios';

export const adalFetch = (
  authContext: UserAgentApplication,
  resource: any,
  axios: any,
  url: string,
  axiosOptions: any
) => {
  return acquireToken({
    scopes: [`${process.env.REACT_APP_AAD_CLIENT_ID}`]
  }).then(() => {
    return Axios(url, axiosOptions);
  });
};
