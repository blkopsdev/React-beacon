import axios from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';
import { Iuser, IinitialState } from '../models';
import { ThunkAction } from 'redux-thunk';
// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getUserManage(
  page: number,
  search: string,
  customerID: string
) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
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
        handleError(error, 'get user queue');
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
        handleError(error, 'update user');
        throw error;
      });
  };
}
export function updateUserProfile(user: Iuser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.user.updateprofile, user)
      .then(data => {
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
        handleError(error, 'update profile');
        throw error;
      });
  };
}

// export function getCustomers() {
//   return (dispatch: any, getState: any) => {
//     dispatch(beginAjaxCall());
//     return axios
//       .get(API.GET.customer.getall)
//       .then(data => {
//         if (!data.data) {
//           throw undefined;
//         } else {
//           dispatch({ type: types.GET_CUSTOMERS_SUCCESS, customers: data.data });
//           // dispatch({ type: types.USER_MANAGE_TOTAL_PAGES, pages: data.data[0] });
//           return data;
//         }
//       })
//       .catch((error: any) => {
//         dispatch({ type: types.GET_CUSTOMERS_FAILED });
//         handleError(error, 'get companies');
//         throw error;
//       });
//   };
// }

// export function getFacilitiesByCustomer(customerID: string) {
//   return (dispatch: any, getState: any) => {
//     dispatch(beginAjaxCall());
//     return axios
//       .get(API.GET.facility.getbycustomer, { params: { customerID } })
//       .then(data => {
//         if (!data.data) {
//           throw undefined;
//         } else {
//           dispatch({
//             type: types.GET_FACILITIES_SUCCESS,
//             facilities: data.data
//           });
//           // dispatch({ type: types.USER_MANAGE_TOTAL_PAGES, pages: data.data[0] });
//           // return data;
//         }
//       })
//       .catch((error: any) => {
//         dispatch({ type: types.GET_FACILITIES_FAILED });
//         handleError(error, 'get facilities');
//         throw error;
//       });
//   };
// }

export const toggleEditUserModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_USER
});
export const toggleEditCustomerModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_CUSTOMER
});
export const toggleEditFacilityModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_FACILITY
});

function handleError(error: any, message: string) {
  let msg = '';
  if (error && error.response && error.response.data) {
    msg = error.response.data;
  } else if (error && error.message) {
    msg = `Failed to ${message}.  Please try again or contact support. ${
      error.message
    }`;
  } else {
    msg = `Failed to ${message}.  Please try again or contact support.`;
  }
  if (!navigator.onLine) {
    msg = 'Please connect to the internet.';
  }
  toastr.error('Error', msg, constants.toastrError);
}
