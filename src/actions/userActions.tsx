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
  redirectUri: constants.adalAuth.redirectUri
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

export function isFullyAuthenticated(user: Iuser) {
  if (isAuthenticated() && user.id) {
    return true;
  } else {
    return false;
  }
}

export function userLogin() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const token = authContext.getCachedToken(authContext.config.clientId);
    console.log('token', token);
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
        let msg =
          error.message ||
          'Failed to login.  Please try again or contact support.';
        if (!navigator.onLine) {
          msg = 'Please connect to the internet.';
        }
        toastr.error('Error', msg, constants.toastrError);
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
    console.log('token', token);
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
    }, 1000); // give it time to persist this to local storage
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
        let msg =
          error.message ||
          'Failed to signup.  Please try again or contact support.';
        if (!navigator.onLine) {
          msg = 'Please connect to the internet.';
        }
        toastr.error('Error', msg, constants.toastrError);
        throw error;
      });
  };
}

export function getUserQueue(page: number, search: string) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .get(API.GET.user.getuserqueue, { params: { page, search } })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_QUEUE_SUCCESS, queue: data.data.users });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_QUEUE_FAILED });
        let msg =
          error.message ||
          'Failed to get new user queue.  Please try again or contact support.';
        if (!navigator.onLine) {
          msg = 'Please connect to the internet.';
        }
        toastr.error('Error', msg, constants.toastrError);
        throw error;
      });
  };
}
