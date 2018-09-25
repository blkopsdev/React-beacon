import axios from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';
import { Iuser, IinitialState, Ifacility } from '../models';
import { ThunkAction } from 'redux-thunk';
// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

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
        constants.handleError(error, 'get user queue');
        throw error;
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
      throw error;
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
        throw error;
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
          dispatch({ type: types.TOGGLE_MODAL_EDIT_QUEUE_USER });
          toastr.success('Success', 'Saved user', constants.toastrSuccess);
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
        throw error;
      });
  };
}

export function getCustomers() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .get(API.GET.customer.getall)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.GET_CUSTOMERS_SUCCESS, customers: data.data });
          // dispatch({ type: types.USER_QUEUE_TOTAL_PAGES, pages: data.data[0] });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_CUSTOMERS_FAILED });
        constants.handleError(error, 'get companies');
        throw error;
      });
  };
}
export function addCustomer({
  name,
  vat
}: {
  name: string;
  vat: string;
}): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.customer.add, { name, vat })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.CUSTOMER_UPDATE_SUCCESS,
            customer: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_CUSTOMER });
          toastr.success('Success', 'Saved Customer', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.CUSTOMER_UPDATE_FAILED });
        constants.handleError(error, 'add customer');
        throw error;
      });
  };
}
export function addFacility(facility: Ifacility): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.facility.add, facility)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.FACILITY_UPDATE_SUCCESS,
            facility: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_FACILITY });
          toastr.success('Success', 'Saved Facility', constants.toastrSuccess);
          // wait for the select options to update then trigger an event that a new facility has been added.
          setTimeout(() => {
            const event = new CustomEvent('newFacility', {
              detail: data.data.id
            });
            document.dispatchEvent(event);
          }, 400);

          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.FACILITY_UPDATE_FAILED });
        constants.handleError(error, 'add facility');
        throw error;
      });
  };
}

export function getFacilitiesByCustomer(customerID: string) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .get(API.GET.facility.getbycustomer, { params: { customerID } })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_FACILITIES_SUCCESS,
            facilities: data.data
          });
          // dispatch({ type: types.USER_QUEUE_TOTAL_PAGES, pages: data.data[0] });
          // return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_FACILITIES_FAILED });
        constants.handleError(error, 'get facilities');
        throw error;
      });
  };
}

export const toggleEditQueueUserModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_QUEUE_USER
});
