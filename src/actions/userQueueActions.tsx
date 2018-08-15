import axios from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';
import { Iuser } from '../models';

export function getUserQueue(page: number, search: string) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .get(API.GET.user.getuserqueue, { params: { page, search } })
      .then(data => {
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
        handleError(error, 'get user queue');
        throw error;
      });
  };
}

export function approveUser(userQueueID: string) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.user.approve, { id: userQueueID })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_APPROVE_SUCCESS, userQueueID });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_APPROVE_FAILED });
        handleError(error, 'approve user');
        throw error;
      });
  };
}
export function rejectUser(userQueueID: string) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.user.reject, { id: userQueueID })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.USER_REJECT_SUCCESS, userQueueID });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_REJECT_FAILED });
        handleError(error, 'reject user');
        throw error;
      });
  };
}
export function updateUser(user: Iuser, queueID: string) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.user.update, user)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.USER_UPDATE_SUCCESS,
            user: data.data,
            queueID
          });
          toastr.success('Success', 'Saved user', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.USER_UPDATE_FAILED });
        handleError(error, 'update user');
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
