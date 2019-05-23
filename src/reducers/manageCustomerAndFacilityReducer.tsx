import initialState from './initialState';
import * as types from '../actions/actionTypes';
import { Icustomer, ImanageCustomerAndFacilityReducer } from '../models';
import {
  createFormValuesWithName,
  createSelectedIDWithName,
  createTableFiltersWithName
} from './commonReducers';
import { pickBy, map } from 'lodash';

export function manageCustomerAndFacilityReducer(
  state: { [key: string]: Icustomer } = initialState.manageCustomerAndFacility
    .data,
  action: any
) {
  switch (action.type) {
    case types.GET_CUSTOMERS_AND_FACILITY_SUCCESS:
      return map(action.payload.result, (customer: Icustomer) => {
        return cleanObject(customer);
      });
    default:
      return state;
  }
}

function visibleCustomersReducer(
  state: Icustomer[] = initialState.manageCustomerAndFacility.visibleCustomers,
  action: any
): Icustomer[] {
  switch (action.type) {
    case types.FILTER_VISIBLE_CUSTOMERS:
      return action.visibleCustomers;
    case types.USER_LOGOUT_SUCCESS:
      return initialState.manageCustomerAndFacility.visibleCustomers;
    default:
      return state;
  }
}

function manageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.CUSTOMERS_AND_FACILITY_TOTAL_PAGES:
      if (action.pages && action.pages > 0) {
        return action.pages;
      }
      return state;
    case types.USER_LOGOUT_SUCCESS:
      return 1;
    default:
      return state;
  }
}

export default function customerAndFacilityManage(
  state: ImanageCustomerAndFacilityReducer = initialState.manageCustomerAndFacility,
  action: any
) {
  return {
    data: manageCustomerAndFacilityReducer(state.data, action),
    totalPages: manageTotalPages(state.totalPages, action),
    visibleCustomers: visibleCustomersReducer(state.visibleCustomers, action),
    customerFormValues: createFormValuesWithName(
      state.customerFormValues,
      action,
      'MANAGE_CUSTOMER'
    ),
    facilityFormValues: createFormValuesWithName(
      state.facilityFormValues,
      action,
      'MANAGE_FACILITY'
    ),
    selectedCustomerID: createSelectedIDWithName(
      state.selectedCustomerID,
      action,
      'CUSTOMER_ID'
    ),
    selectedFacilityID: createSelectedIDWithName(
      state.selectedFacilityID,
      action,
      'FACILITY_ID'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_CUSTOMER_AND_FACILITY'
    )
  };
}

const cleanObject = (customer: Icustomer) => {
  return {
    ...pickBy(customer, property => property !== null)
  } as Icustomer;
};
