// import { adalFetch, withAdalLogin } from 'react-adal';
import * as AuthenticationContext from 'adal-angular';

const resource = 'e5fb8173-e048-4cda-8acd-a8e735b4c927'; // same as clientID

export const authContext = new AuthenticationContext({
  tenant: 'a675e2fc-4806-4ec9-b49c-b0dc413b0e6b',
  clientId: 'e5fb8173-e048-4cda-8acd-a8e735b4c927',
  cacheLocation: 'localStorage',
  redirectUri: 'http://localhost:3000'
});

export function isAuthenticated() {
  let isAuth = false;
  authContext.acquireToken(
    resource,
    (message: string, token: string, msg: string) => {
      if (!msg) {
        isAuth = true;
      } else {
        console.error(`message: ${message}  msg: ${msg}`);
        if (msg === 'login required') {
          const tokenT = authContext.getCachedToken(
            authContext.config.clientId
          );
          console.log(`should we try to automatically login here? ${tokenT}`);
        }
        isAuth = false;
      }
    }
  );
  return isAuth;
}
