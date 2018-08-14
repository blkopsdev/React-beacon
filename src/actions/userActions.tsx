import axios from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';
import * as AuthenticationContext from 'adal-angular';

import { ItempUser, Iuser } from '../models';

export const authContext = new AuthenticationContext({
  tenant: constants.adalAuth.tenant,
  clientId: constants.adalAuth.clientId,
  cacheLocation: 'localStorage',
  redirectUri: `${process.env.REACT_APP_HOST_DOMAIN}`
});

export function isAuthenticated() {
  let isAuth = false;
  const resource = constants.adalAuth.clientId;
  authContext.acquireToken(
    resource,
    (message: string, token: string, msg: string) => {
      if (!msg) {
        isAuth = true;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      } else {
        // console.error(`message: ${message}  msg: ${msg}`);
        // if (msg === 'login required') {
        //   const tokenT = authContext.getCachedToken(
        //     authContext.config.clientId
        //   );
        //   console.log(`should we try to automatically login here? ${tokenT}`);
        // }
        isAuth = false;
      }
    }
  );
  return isAuth;
}

export function isFullyAuthenticated(user: Iuser) {
  if (isAuthenticated() && user.id) {
    return true;
  } else {
    return false;
  }
}

// export function hasSecurityFunction (securityFunction: string) {
//   return (dispatch: any, getState: any) => {
//     if (getState().user.securityFunctions.indexOf(securityFunction) >= 0) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   }

export function userLogin() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const token = authContext.getCachedToken(authContext.config.clientId);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    dispatch({ type: types.AAD_LOGIN_SUCCESS, token });
    return axios
      .post(API.POST.user.login)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_LOGIN_SUCCESS, user: data.data });
          toastr.success('Success', 'Logged in.');
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_LOGIN_FAILED });
        handleError(error, 'login');
        throw error;
      });
  };
}
export function adalLogin() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    authContext.login();
  };
}

export const getToken = () => {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const token = authContext.getCachedToken(authContext.config.clientId);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    dispatch({ type: types.AAD_LOGIN_SUCCESS, token });
    // return token;
  };
};

export function userLogout() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.USER_LOGOUT_SUCCESS });
    setTimeout(() => {
      authContext.logOut();
    }, 100); // give it time to persist this to local storage
    // authContext.logOut();
  };
}

export function signUpDirect(tempUser: ItempUser) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.user.signup, tempUser)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_SIGNUP_SUCCESS, user: data.data });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_SIGNUP_FAILED });
        handleError(error, 'sign up');
        throw error;
      });
  };
}

function handleError(error: any, message: string) {
  let msg = '';
  if (error.response && error.response.data) {
    msg = error.response.data;
  } else {
    msg = `Failed to ${message}.  Please try again or contact support. ${
      error.message
    }`;
  }
  if (!navigator.onLine) {
    msg = 'Please connect to the internet.';
  }
  toastr.error('Error', msg, constants.toastrError);
}
