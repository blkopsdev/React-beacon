import axios from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';
import * as AuthenticationContext from 'adal-angular';

import { ItempUser, Iuser, IinitialState } from '../models';
import { ThunkAction } from 'redux-thunk';
import * as localForage from 'localforage';
// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export const authContext = new AuthenticationContext({
  tenant: constants.adalAuth.tenant,
  clientId: constants.adalAuth.clientId,
  cacheLocation: 'localStorage',
  redirectUri: `${process.env.REACT_APP_HOST_DOMAIN}`
});

export function checkCachedToken() {
  return !!authContext.getCachedToken(authContext.config.clientId);
}

export function setCachedToken() {
  const cachedToken = authContext.getCachedToken(authContext.config.clientId);

  if (!cachedToken) {
    authContext.login();
  } else {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + cachedToken;
  }
}

export function getCachedToken() {
  const cachedToken = authContext.getCachedToken(authContext.config.clientId);

  if (!cachedToken) {
    return '';
  } else {
    return cachedToken;
  }
}
// export function setCachedToken() {
//   console.log('setting cached token')
//   authContext.acquireToken(authContext.config.clientId, (errorDesc, token, error) => {
//     if (!token) {
//     authContext.login();
//   } else {
//     axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
//   }
//   })
// }

const handleAdalLoginSuccess = (token: string, dispatch: any) => {
  console.log('user is logged in and token is valid');
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  dispatch({
    type: types.AAD_LOGIN,
    isAuthenticated: true
  });
};

export function userLogin(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const token = authContext.getCachedToken(authContext.config.clientId);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    dispatch({ type: types.AAD_LOGIN, token });
    return axios
      .post(API.POST.user.login)
      .then(data => {
        console.log('login data', data.data);
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_LOGIN_SUCCESS, user: data.data });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_LOGIN_FAILED });
        constants.handleError(error, 'login');
        // to avoid getting stuck, go ahead and log the user out after a longer pause
        setTimeout(() => {
          authContext.logOut();
        }, 3000); // give it time to persist this to local storage

        throw error;
      });
  };
}
export function adalLogin(): ThunkResult<void> {
  return (dispatch, getState) => {
    // dispatch(beginAjaxCall()); removing loading here beacuse when we come back from adal login,
    // is when the success is called and it closses loading while userLogin is still waiting.
    const resource = constants.adalAuth.clientId;
    authContext.acquireToken(
      resource,
      (message: string, token: string, msg: string) => {
        if (!msg) {
          handleAdalLoginSuccess(token, dispatch);
        } else {
          console.error(`message: ${message}  msg: ${msg}`);
          if (msg === 'login required') {
            const tokenT = authContext.getCachedToken(
              authContext.config.clientId
            );
            console.log(`should we try to automatically login here? ${tokenT}`);
          }
          authContext.login();
        }
      }
    );
  };
}

export function userLogout(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch({ type: types.USER_LOGOUT_SUCCESS });
    dispatch({ type: 'RESET_STATE' }); // reset the redux-offline outbox
    localForage.removeItem('state-core-care-web').then(() => {
      authContext.logOut();
    });
  };
}

export function signUpDirect(tempUser: ItempUser): ThunkResult<void> {
  return (dispatch, getState) => {
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
        constants.handleError(error, 'sign up');
        throw error;
      });
  };
}

export const toggleEditProfileModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_PROFILE
});

export function updateUserProfile(user: Iuser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.user.updateprofile, user)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.USER_UPDATE_PROFILE_SUCCESS,
            user: data.data
          });
          toastr.success('Success', 'Saved profile', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_UPDATE_PROFILE_FAILED });
        constants.handleError(error, 'update profile');
        throw error;
      });
  };
}
