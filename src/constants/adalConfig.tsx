// import { adalFetch, withAdalLogin } from 'react-adal';
import * as AuthenticationContext from 'adal-angular';

const resource: string = '9eced824-e4db-436e-ad99-82391d4b9f25';

export const authContext = new AuthenticationContext({
  tenant: 'c4c919d8-b946-48a3-a1c3-eb12b3e1f83b',
  clientId: '9eced824-e4db-436e-ad99-82391d4b9f25',
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
