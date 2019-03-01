import { ThunkAction } from 'redux-thunk';
// import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import { IinitialState, ItableFiltersParams, Iuser } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';

// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getUserQueue(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageUserQueue.tableFilters;
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
      constants.handleError(error, 'approve user');
    });
}

// export function anotherThunkAction(): ThunkResult<Promise<boolean>> {
//   return (dispatch, getState) => {
//     return Promise.resolve(true);
//   }
// }
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
        constants.handleError(error, 'reject user');
      });
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
    return axios
      .post(API.POST.user.update, user)
      .then(data => {
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
