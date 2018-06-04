import axios from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';
import { authContext } from '../constants/adalConfig';

// import {Iuser} from '../models';

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
    authContext.logOut();
    dispatch(beginAjaxCall());
    return new Promise((resolve, reject) => {
      dispatch({ type: types.USER_LOGOUT_SUCCESS });
      resolve();
    });
  };
}
