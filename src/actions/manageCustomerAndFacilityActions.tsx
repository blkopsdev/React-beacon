import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';
import { ItableFiltersParams, Icustomer, IinitialState } from '../models';
import { filter, orderBy, values } from 'lodash';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as moment from 'moment';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getCustomers() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const { tableFilters } = getState().customerAndFacilityManage;
    const { page, name } = tableFilters;
    const newPage = page + 1; // since we are using front end filtering the pag# is zero indexed, but the API is not
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page: newPage, name, pagingType: 'paged' }
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

export function filterVisibleCustomers(): ThunkResult<void> {
  return (dispatch, getState) => {
    const { tableFilters } = getState().customerAndFacilityManage;
    const { customers } = getState();
    filterVisibleCustomersHelper(values(customers), tableFilters, dispatch);
  };
}
const filterVisibleCustomersHelper = (
  customers: Icustomer[],
  tableFilters: ItableFiltersParams,
  dispatch: Dispatch
) => {
  const { name } = tableFilters;
  let visibleCustomers = filter(customers, (customer: Icustomer) => {
    let shouldInclude = true;
    if (name && customer.name.toLowerCase().search(name.toLowerCase()) === -1) {
      shouldInclude = false;
    }
    if (customer.isDeleted === true) {
      shouldInclude = false;
    }
    return shouldInclude;
  });
  visibleCustomers = orderBy(
    visibleCustomers,
    res => moment.utc(res.createDate).unix(),
    'desc'
  );
  dispatch({
    type: types.FILTER_VISIBLE_CUSTOMERS,
    visibleCustomers
  });
};
