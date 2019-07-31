import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import { constants } from '../constants/constants';

import { ItempUser, Iuser, IinitialState } from '../models';
import { ThunkAction } from 'redux-thunk';
import * as localForage from 'localforage';
import { Dispatch } from 'react-redux';
import { TrackJS } from 'trackjs';
import { map, differenceBy } from 'lodash';
import { AuthResponse } from 'msal';
import {
  msalFetch,
  msalApp,
  acquireToken,
  MSAL_SCOPES
} from '../components/auth/Auth-Utils';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function userLogin(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return acquireToken().then((authResponse: AuthResponse) => {
      const token = authResponse.accessToken;
      dispatch({ type: types.AAD_LOGIN, token });
      const axiosOptions: AxiosRequestConfig = {
        method: 'post'
      };
      const url = API.POST.user.login;
      return msalFetch(url, axiosOptions)
        .then((data: AxiosResponse<any>) => {
          if (!data.data) {
            throw undefined;
          } else {
            dispatch({ type: types.USER_LOGIN_SUCCESS, user: data.data });
            TrackJS.configure({
              userId: data.data.email,
              version: process.env.REACT_APP_VERSION
            });
            return data;
          }
        })
        .catch((error: any) => {
          console.error('failed to login', error);
          dispatch({ type: types.USER_LOGIN_FAILED });
          userLogoutHelper(dispatch);
          // to avoid getting stuck, go ahead and log the user out after a longer pause
          constants.handleError(error, 'login');
          throw error; // intentionally re-throw
        });
    });
  };
}
export function MSALlogin(): ThunkResult<void> {
  return (dispatch, getState) => {
    return msalApp.loginRedirect({
      scopes: [MSAL_SCOPES.MMG]
    });
  };
}

/*
* reauthenticate in the background if possible
* April 24th - this can likely be removed now that we are doing login() right from the error hanndling function in constants.tsx
*/
export const adalReauth = () => {
  acquireToken();
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
  const event = new Event('userLogout');
  document.dispatchEvent(event);
  localForage.removeItem('med-gas-mobile_all-products');
};

export function signUpDirect(tempUser: ItempUser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return Axios.post(API.POST.user.signup, tempUser)
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
        throw error; // intentionally re-throw
      });
  };
}

export const toggleEditProfileModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_PROFILE
});

export function updateUserProfile(formValues: {
  [key: string]: any;
}): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_PROFILE });
    const { user } = getState();
    const facilities = map(
      formValues.facilities,
      (option: { value: string; label: string }) => {
        return { id: option.value };
      }
    );

    const { first, last, phone, position } = formValues;
    const updatedUser: Iuser = {
      ...user,
      facilities,
      first,
      last,
      phone,
      position
    };

    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: updatedUser
    };

    const url = API.POST.user.updateprofile;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.USER_UPDATE_PROFILE_SUCCESS,
            user: data.data
          });

          // if the user changed their facilities we need to log them out
          console.log(
            differenceBy(user.facilities, data.data.facilities, 'id'),
            differenceBy(data.data.facilities, user.facilities, 'id')
          );
          if (
            differenceBy(user.facilities, data.data.facilities, 'id').length >
              0 ||
            differenceBy(data.data.facilities, user.facilities, 'id').length > 0
          ) {
            toastr.warning(
              'Logging out',
              'Updating currently logged in user requires logging out.',
              constants.toastrSuccess
            );
            setTimeout(() => {
              dispatch({ type: types.USER_LOGOUT_SUCCESS });
              localForage.removeItem('state-core-care-web').then(() => {
                msalApp.logout();
              });
            }, 5000);
          } else {
            toastr.success('Success', 'Saved profile', constants.toastrSuccess);
          }
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

    const url = API.DELETE.user;
    return msalFetch(url, axiosOptions)
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
