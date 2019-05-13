import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';
import { ItableFiltersParams } from '../models';

export function getCustomers() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const { page, name } = getState().customerAndFacilityManage.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, name }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.customer.search;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_CUSTOMERS_AND_FACILITY_SUCCESS,
            payload: data.data
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
        constants.handleError(error, 'get brands');
        console.error(error);
      });
  };
}

export const updateCustomerFormValue = (formValue: any) => ({
  type: types.UPDATE_FORM_VALUES_MANAGE_CUSTOMER,
  formValue
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
