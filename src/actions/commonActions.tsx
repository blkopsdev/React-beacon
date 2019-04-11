import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Ifacility, ThunkResult } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';

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
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { customerID }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.facility.getbycustomer;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_FACILITIES_SUCCESS,
            facilities: data.data
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_FACILITIES_FAILED });
        constants.handleError(error, 'get facilities');
        console.error(error);
      });
  };
}

export function getCustomers() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.customer.getall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
        console.error(error);
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { name, vat }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.customer.add;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
        console.error(error);
      });
  };
}
export function addFacility(facility: Ifacility): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: facility
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.facility.add;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
        console.error(error);
      });
  };
}
