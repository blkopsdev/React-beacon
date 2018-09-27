import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import { Ifacility, ThunkResult } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import constants from '../constants/constants';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';

export const closeAllModals = () => ({
  type: types.CLOSE_ALL_MODALS
});
export const toggleEditCustomerModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_CUSTOMER
});
export const toggleEditFacilityModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_FACILITY
});

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
