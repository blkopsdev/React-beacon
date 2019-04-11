import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import { constants } from 'src/constants/constants';
import * as AuthenticationContext from 'adal-angular';

import { ItempUser, Iuser, IinitialState } from '../models';
import { ThunkAction } from 'redux-thunk';
import * as localForage from 'localforage';
import { adalFetch } from 'react-adal';
import { Dispatch } from 'react-redux';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export const authContext = new AuthenticationContext({
  tenant: `${process.env.REACT_APP_ADAL_TENANT}`,
  clientId: `${process.env.REACT_APP_ADAL_CLIENTID}`,
  cacheLocation: 'localStorage',
  redirectUri: `${process.env.REACT_APP_HOST_DOMAIN}`
});

export function checkCachedToken() {
  return !!authContext.getCachedToken(authContext.config.clientId);
}

export function setCachedToken() {
  const cachedToken = authContext.getCachedToken(authContext.config.clientId);

  if (!cachedToken) {
    adalReauth();
  } else {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + cachedToken; // TODO remove this after refactoring to add adalFetch
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.user.login;
    return adalFetch(authContext, resource, axios, url, axiosOptions).then(
      (data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_LOGIN_SUCCESS, user: data.data });
          return data;
        }
      },
      (error: any) => {
        console.error('failed to login', error);
        dispatch({ type: types.USER_LOGIN_FAILED });
        userLogoutHelper(dispatch);
        // to avoid getting stuck, go ahead and log the user out after a longer pause
        constants.handleError(error, 'login');
        throw error;
      }
    );
  };
}
export function adalLogin(): ThunkResult<void> {
  return (dispatch, getState) => {
    // dispatch(beginAjaxCall()); removing loading here beacuse when we come back from adal login,
    // is when the success is called and it closses loading while userLogin is still waiting.
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    authContext.acquireToken(
      resource,
      (message: string, token: string, msg: string) => {
        if (!msg) {
          handleAdalLoginSuccess(token, dispatch);
        } else {
          console.error(`message: ${message}  msg: ${msg}`);
          if (msg === 'login required') {
            authContext.login();
          }
        }
      }
    );
  };
}

/*
* reauthenticate in the background if possible
*/
export const adalReauth = () => {
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  authContext.acquireToken(
    resource,
    (message: string, token: string, msg: string) => {
      if (!msg) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      } else {
        console.error(`Error with reAuth: message: ${message}  msg: ${msg}`);
        if (msg === 'login required') {
          authContext.login();
        }
      }
    }
  );
};

export function userLogout(): ThunkResult<void> {
  return (dispatch, getState) => {
    userLogoutHelper(dispatch);
  };
}
const userLogoutHelper = (dispatch: Dispatch) => {
  dispatch({ type: types.USER_LOGOUT_SUCCESS });
  dispatch({ type: 'Offline/RESET_STATE' }); // reset the redux-offline outbox
  dispatch({ type: '@ReduxToastr/toastr/CLEAN_TOASTR' }); // reset the toastr

  setTimeout(() => {
    localForage.removeItem('state-core-care-web').then(() => {
      authContext.logOut();
    });
  }, 500);
};

export function signUpDirect(tempUser: ItempUser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: tempUser
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.user.signup;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
        console.error(error);
      });
  };
}

export const toggleEditProfileModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_PROFILE
});

export function updateUserProfile(user: Iuser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_PROFILE });
    // use this to test handling of expired auth token 401
    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiJlNWZiODE3My1lMDQ4LTRjZGEtOGFjZC1hOGU3MzViNGM5MjciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hNjc1ZTJmYy00ODA2LTRlYzktYjQ5Yy1iMGRjNDEzYjBlNmIvIiwiaWF0IjoxNTQ2ODg3NjAwLCJuYmYiOjE1NDY4ODc2MDAsImV4cCI6MTU0Njg5MTUwMCwiYWlvIjoiQVVRQXUvOEpBQUFBWjkxbTlnRUtNSHlHb0pnVVQvVXoweVllYy8zT0QxdWVZVHkvQXNPeFM2bGNSQk1tUlRJbWJubURXMXNLNVJUanErWEZzM0dNR3phZlltMUJHMU5zMVE9PSIsImFtciI6WyJwd2QiXSwiZW1haWwiOiJqb25AdGhlYmlncGl4ZWwubmV0IiwiZmFtaWx5X25hbWUiOiJGbG93ZXIiLCJnaXZlbl9uYW1lIjoiSm9uYXRoYW4iLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81MGI3ODFiMy0yOWY5LTQ5ZWMtODZjMS0yNjkwNGQxNDc2MzkvIiwiaXBhZGRyIjoiMjA5LjM0LjAuMTgyIiwibmFtZSI6IkpvbmF0aGFuIEZsb3dlciIsIm5vbmNlIjoiYmE2MGY5MjItOWJhZC00MzY5LThjMDItZTkwMjFmMTM0ODk5Iiwib2lkIjoiMjkyZGEwYTYtNTljZS00YTZhLWJkZDUtM2QxOTVkYjZiYzYwIiwic3ViIjoienktNHFPMzRVTnM0ZGRuWlloM3JZQmJGWVp6UjFKNUZmVXVkUExxQ1NDdyIsInRpZCI6ImE2NzVlMmZjLTQ4MDYtNGVjOS1iNDljLWIwZGM0MTNiMGU2YiIsInVuaXF1ZV9uYW1lIjoiam9uQHRoZWJpZ3BpeGVsLm5ldCIsInV0aSI6ImthVFVScXFmTEVpWDFiV2F3OTlCQUEiLCJ2ZXIiOiIxLjAifQ.m8wP_uJlIwa-dSM_ZfqnWXaQpwlXhoe0BdZEfI2FVKnDEFyJXnCQN3b3EsuhCkng-_TqrZHpLT8zSNw-1vFpM4FTiyI9PAzN_rC0Cw7q5q40raP1COV7tJ5K6-ZehpGKh32mGZIcGs1gEdtkvhSSwlb3aiR2d8rkCePjb2S4FyRK3uulRYRCo2_CJ4kMFAt1FFz-cwT-uhwUb0_etpk1JM1yOTeu1coI4sRCwo7Y7CHRKaiLpeVO_5FQ8UlzDigxTocnxlWR1DeYWkBMsXOS8UEUV2I94ZDXtZ9RXrQQfETp3yuvtKWhXxFt9WNrwMX0fQrhWIJrstd92T7IE3X5dQ`
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: user
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.user.updateprofile;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
        console.error(error);
      });
  };
}

export function deleteUserAccount(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_PROFILE });
    const axiosOptions: AxiosRequestConfig = {
      method: 'delete'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.DELETE.user;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          userLogoutHelper(dispatch);
        }
      })
      .catch((error: any) => {
        dispatch(endAjaxCall());
        constants.handleError(error, 'delete profile');
        console.error(error);
      });
  };
}
