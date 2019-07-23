import {
  UserAgentApplication,
  AuthResponse,
  AuthenticationParameters,
  AuthError
} from 'msal';
import Axios, { AxiosRequestConfig } from 'axios';
import { toastr } from 'react-redux-toastr';
import { constants } from 'src/constants/constants';

export const isIE = () => {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ') > -1;
  const msie11 = ua.indexOf('Trident/') > -1;

  // If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
  // const isEdge = ua.indexOf("Edge/") > -1;

  return msie || msie11;
};

export const MSAL_SCOPES = {
  MMG: 'https://beaconb2c.onmicrosoft.com/mmg-api/read',
  OPENID: 'openid'
};

export const requiresInteraction = (errorMessage: string) => {
  if (!errorMessage || !errorMessage.length) {
    return false;
  }

  return (
    errorMessage.indexOf('consent_required') > -1 ||
    errorMessage.indexOf('interaction_required') > -1 ||
    errorMessage.indexOf('login_required') > -1
  );
};
const MSAL_AUTHORITY = `https://login.microsoftonline.com/tfp/${
  process.env.REACT_APP_MSAL_TENANT_ID
}/${process.env.REACT_APP_MSAL_SIGNIN_POLICY}/v2.0`;
const MSAL_FORGET = `https://login.microsoftonline.com/tfp/beaconb2c.onmicrosoft.com/
${
  process.env.REACT_APP_MSAL_FORGET_PASSWORD_POLICY
}/oauth2/v2.0/authorize?client_id=${process.env.REACT_APP_MSAL_CLIENT_ID}
&redirect_uri=${process.env.REACT_APP_HOST_DOMAIN}&response_type=id_token&
scope=${MSAL_SCOPES.MMG} ${
  MSAL_SCOPES.OPENID
}&response_mode=fragment&nonce=123465`;

/*
* temporarily set the callback because sometimes the callback we set inside app.tsx 
* does not run soon enough and MSAL complains that we have not set a redirect callback.
* here we use a javascript alert because we know that is loaded.
*/
const temporaryHandleRedirectCallback = (
  error: AuthError,
  response?: AuthResponse
) => {
  console.error('msalRedirectCallback', error);
  if (error) {
    const forgotPasswordError =
      error.message.indexOf('The user has forgotten their password') > -1;
    const forgotPasswordCancel =
      error.errorMessage.indexOf('user has cancelled entering') > -1;

    if (forgotPasswordError) {
      window.location.replace(MSAL_FORGET);
      return;
    }
    if (forgotPasswordCancel) {
      window.location.replace(`${process.env.REACT_APP_HOST_DOMAIN}`);
      return;
    }
    let errorMessage = error.errorMessage;
    const firstIndex = error.errorMessage.indexOf('Correlation ID:');
    const secondIndex = 12; // index after the error code
    const messageTextOnly = error.errorMessage.substring(
      firstIndex,
      secondIndex
    );
    if (messageTextOnly.length) {
      errorMessage = messageTextOnly;
    }
    alert(errorMessage);
  }
};

export const msalApp = new UserAgentApplication({
  auth: {
    clientId: `${process.env.REACT_APP_MSAL_CLIENT_ID}`,
    authority: MSAL_AUTHORITY,
    validateAuthority: false,
    postLogoutRedirectUri: `${process.env.REACT_APP_HOST_DOMAIN}`,
    redirectUri: `${process.env.REACT_APP_HOST_DOMAIN}`,
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: isIE()
  },
  system: {
    tokenRenewalOffsetSeconds: -120
  }
});

msalApp.handleRedirectCallback(temporaryHandleRedirectCallback);

export const acquireToken = () => {
  const redirect = true; // force redirect method because in order to support the popup we will need to add some code that will re-try the requests
  const request: AuthenticationParameters = {
    scopes: [MSAL_SCOPES.MMG]
  };
  return msalApp.acquireTokenSilent(request).catch(error => {
    // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
    // due to consent or interaction required ONLY
    if (requiresInteraction(error.errorCode)) {
      // set the redirect in redux
      document.dispatchEvent(new Event('setRedirect'));
      setTimeout(() => {
        return redirect
          ? msalApp.acquireTokenRedirect(request)
          : msalApp.acquireTokenPopup(request);
      }, 1000);
    } else {
      return error;
    }
  });
};

export const msalFetch = (
  url: string,
  options: AxiosRequestConfig,
  isRetry?: boolean
): Promise<any> => {
  return acquireToken().then((tokenResponse: AuthResponse) => {
    // console.log('msalFetch tokenResponse: ', tokenResponse);
    if (!tokenResponse || tokenResponse.accessToken === null) {
      console.error('missing token', tokenResponse);
      if (!isRetry) {
        console.log('retrying msalFetch');
        return msalFetch(url, options, true);
      } else {
        msalApp.loginRedirect({ prompt: 'login' });
        throw new Error('unable to renew token');
      }
    }
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${tokenResponse.accessToken}`
    };
    const axiosOptions = { ...options, headers };
    return Axios(url, axiosOptions);
  });
};
