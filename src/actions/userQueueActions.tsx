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
export function updateUser(
  user: Iuser,
  shouldApprove: boolean,
  queueID: string
) {
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
          dispatch({ type: types.TOGGLE_EDIT_USER_MODAL });
          toastr.success('Success', 'Saved user', constants.toastrSuccess);
          if (shouldApprove) {
            return approveUser(queueID);
          }
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
        handleError(error, 'get companies');
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
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_FACILITIES_FAILED });
        handleError(error, 'get facilities');
        throw error;
      });
  };
}

export const toggleEditUserModal = () => ({
  type: types.TOGGLE_EDIT_USER_MODAL
});
export const toggleEditCompanyModal = () => ({
  type: types.TOGGLE_EDIT_COMPANY_MODAL
});
export const toggleEditFacilityModal = () => ({
  type: types.TOGGLE_EDIT_FACILITY_MODAL
});

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
