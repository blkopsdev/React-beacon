import { ThunkAction } from 'redux-thunk';
// import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { IinitialState, ItableFiltersParams, Iuser } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getUserQueue(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageUserQueue.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, search }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.user.getuserqueue;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_QUEUE_SUCCESS, queue: data.data[1] });
          dispatch({ type: types.USER_QUEUE_TOTAL_PAGES, pages: data.data[0] });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_QUEUE_FAILED });
        constants.handleError(error, 'get user queue');
      });
  };
}

export function approveUser(userQueueID: string): any {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return handleApproveUser(userQueueID, dispatch);
  };
}
function handleApproveUser(userQueueID: string, dispatch: any) {
  const axiosOptions: AxiosRequestConfig = {
    method: 'post',
    data: { id: userQueueID }
  };
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  const url = API.POST.user.approve;
  return adalFetch(authContext, resource, axios, url, axiosOptions).then(
    (data: AxiosResponse<any>) => {
      if (!data.data) {
        throw undefined;
      } else {
        dispatch({ type: types.USER_APPROVE_SUCCESS, userQueueID });
        return data;
      }
    },
    (error: any) => {
      dispatch({ type: types.USER_APPROVE_FAILED });
      constants.handleError(error, 'approve user');
      throw error;
    }
  );
}

// export function anotherThunkAction(): ThunkResult<Promise<boolean>> {
//   return (dispatch, getState) => {
//     return Promise.resolve(true);
//   }
// }
export function rejectUser(userQueueID: string) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { id: userQueueID }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.user.reject;
    return adalFetch(authContext, resource, axios, url, axiosOptions).then(
      (data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_REJECT_SUCCESS, userQueueID });
          return data;
        }
      },
      (error: any) => {
        dispatch({ type: types.USER_REJECT_FAILED });
        constants.handleError(error, 'reject user');
        throw error;
      }
    );
  };
}
export function updateQueueUser(
  user: Iuser,
  shouldApprove: boolean,
  queueID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_QUEUE_USER });
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
            type: types.USER_QUEUE_UPDATE_SUCCESS,
            user: data.data,
            queueID
          });

          // toastr.success('Success', 'Saved user', constants.toastrSuccess);
          if (shouldApprove) {
            dispatch(beginAjaxCall());
            handleApproveUser(queueID, dispatch); // don't return this because if we do, we will see two errors
          }
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_QUEUE_UPDATE_FAILED });
        constants.handleError(error, 'update user');
      });
  };
}

export const toggleEditQueueUserModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_QUEUE_USER
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_USER_QUEUE,
  filters
});
