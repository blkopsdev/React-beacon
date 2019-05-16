import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';
import {
  ItableFiltersParams,
  Icustomer,
  IinitialState,
  Ifacility
} from '../models';
import { filter, orderBy, values } from 'lodash';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getCustomers() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const { tableFilters } = getState().customerAndFacilityManage;
    const { page, search } = tableFilters;
    const newPage = page + 1; // since we are using front end filtering the page# is zero indexed, but the API is not
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      // TODO change this to paged once the API is sorted by name... or maybe just keep it as none.
      // once this is paged there is as small possibility that an updated Company will not be received even though it is visible in the table.
      // this could be resolved by switching to "windowed" type paging since then we can define the size of the page.
      params: { page: newPage, search, pagingType: 'none' }
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
        constants.handleError(error, 'get Customers');
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
    const { customers, facilities } = getState();
    filterVisibleCustomersHelper(
      values(customers),
      facilities,
      tableFilters,
      dispatch
    );
  };
}
const filterVisibleCustomersHelper = (
  customers: Icustomer[],
  facilities: { [key: string]: Ifacility },
  tableFilters: ItableFiltersParams,
  dispatch: Dispatch
) => {
  const { search } = tableFilters;
  // get the most up to date facility objects
  const customersWithUpdatedFacilities = customers.map(
    (customer: Icustomer) => {
      if (customer.facilities) {
        const updatedFacilities = customer.facilities.map(facility => ({
          ...facility,
          ...facilities[facility.id]
        }));
        return { ...customer, facilities: updatedFacilities };
      } else {
        return customer;
      }
    }
  );
  let visibleCustomers = filter(
    customersWithUpdatedFacilities,
    (customer: Icustomer) => {
      let shouldInclude = true;
      if (
        search &&
        customer.name.toLowerCase().search(search.toLowerCase()) === -1
      ) {
        shouldInclude = false;
      }
      if (customer.isDeleted === true) {
        shouldInclude = false;
      }
      return shouldInclude;
    }
  );
  visibleCustomers = orderBy(visibleCustomers, 'name');
  dispatch({
    type: types.FILTER_VISIBLE_CUSTOMERS,
    visibleCustomers
  });
};
