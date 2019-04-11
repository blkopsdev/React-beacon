import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { IinitialState, ItableFiltersParams, Iuser } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import * as localForage from 'localforage';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getUserManage(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search, customer } = getState().manageUser.tableFilters;
    const customerID = customer ? customer.value : '';
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, search, customerID }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.user.getusersearch;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_MANAGE_SUCCESS, users: data.data[1] });
          dispatch({
            type: types.USER_MANAGE_TOTAL_PAGES,
            pages: data.data[0]
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_MANAGE_FAILED });
        constants.handleError(error, 'get users');
        console.error(error);
      });
  };
}
/*
  * If the user updates themselves, log them out so that the changes are actually reflected
  */
const checkForLoggedInUser = (
  userID: string,
  updatedUserID: string,
  dispatch: any
) => {
  if (userID === updatedUserID) {
    toastr.warning(
      'Logging out',
      'Updating currently logged in user requires logging out.',
      constants.toastrSuccess
    );
    setTimeout(() => {
      dispatch({ type: types.USER_LOGOUT_SUCCESS });
      localForage.removeItem('state-core-care-web').then(() => {
        authContext.logOut();
      });
    }, 5000);
  }
};
export function updateUser(user: Iuser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_USER });
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: user
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.user.update;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.USER_UPDATE_SUCCESS,
            user: data.data
          });

          // toastr.success('Success', 'Saved user', constants.toastrSuccess);
          checkForLoggedInUser(user.id, getState().user.id, dispatch);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_UPDATE_FAILED });
        constants.handleError(error, 'update user');
        console.error(error);
      });
  };
}

export const toggleEditUserModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_USER
});
export const toggleSecurityFunctionsModal = () => ({
  type: types.TOGGLE_MODAL_SECURITY_FUNCTIONS
});
export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_USER,
  filters
});
