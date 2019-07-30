import { beginAjaxCall } from './ajaxStatusActions';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { msalFetch } from 'src/components/auth/Auth-Utils';

import * as types from './actionTypes';
import { constants } from '../constants/constants';
import { ItableFiltersParams, IinitialState } from '../models';

import { ThunkAction } from 'redux-thunk';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getCustomers(): ThunkResult<void> {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const { tableFilters } = getState().manageCustomerAndFacility;
    const { page, name } = tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      // TODO change this to paged once the API is sorted by name... or maybe just keep it as none.
      // once this is paged there is as small possibility that an updated Company will not be received even though it is visible in the table.
      // this could be resolved by switching to "windowed" type paging since then we can define the size of the page.
      params: { page, name }
    };

    const url = API.GET.customer.search;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_CUSTOMERS_AND_FACILITY_SUCCESS,
            payload: data.data.result
          });
          dispatch({
            type: types.CUSTOMERS_AND_FACILITY_TOTAL_PAGES,
            pages: data.data.pages
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_CUSTOMERS_AND_FACILITY_FAILED });
        constants.handleError(error, 'get Customers');
        console.error(error);
      });
  };
}

export function getCustomerLogo(customerID: string): ThunkResult<void> {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };

    const url = API.GET.customer.getlogo.replace('{customerId}', customerID);
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_CUSTOMER_IMAGE_SUCCESS,
            payload: data.data
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_CUSTOMER_IMAGE_FAILED });
        constants.handleError(error, 'get Customer Image');
        console.error(error);
      });
  };
}

export const updateCustomerFormValue = (formValues: any) => ({
  type: types.UPDATE_FORM_VALUES_MANAGE_CUSTOMER,
  formValues
});

export const setCustomerFormValues = (formValues: any) => ({
  type: types.SET_FORM_VALUES_MANAGE_CUSTOMER,
  formValues
});

export const updateFacilityFormValue = (formValue: any) => ({
  type: types.UPDATE_FORM_VALUES_MANAGE_FACILITY,
  formValue
});
export const setFacilityFormValues = (formValues: any) => ({
  type: types.SET_FORM_VALUES_MANAGE_FACILITY,
  formValues
});

export const setSelectedCustomerID = (id: string) => ({
  type: types.SET_SELECTED_CUSTOMER_ID,
  id
});

export const clearSelectedCustomerID = () => ({
  type: types.CLEAR_SELECTED_CUSTOMER_ID
});

export const setSelectedFacilityID = (id: string) => ({
  type: types.SET_SELECTED_FACILITY_ID,
  id
});

export const clearSelectedFacilityID = () => ({
  type: types.CLEAR_SELECTED_FACILITY_ID
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_CUSTOMER_AND_FACILITY,
  filters
});
