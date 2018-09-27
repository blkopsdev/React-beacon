import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import { IinitialState, ItableFiltersParams, Iuser } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';

// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getUserManage(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search, customer } = getState().manageUser.tableFilters;
    const customerID = customer ? customer.value : '';
    return axios
      .get(API.GET.user.getusersearch, { params: { page, search, customerID } })
      .then(data => {
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
        constants.handleError(error, 'get user queue');
        throw error;
      });
  };
}

export function updateUser(user: Iuser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.user.update, user)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.USER_UPDATE_SUCCESS,
            user: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_USER });
          toastr.success('Success', 'Saved user', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_UPDATE_FAILED });
        constants.handleError(error, 'update user');
        throw error;
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
