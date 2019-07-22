import initialState from './initialState';
import * as types from '../actions/actionTypes';
import { Icustomer, ImanageCustomerAndFacilityReducer } from '../models';
import {
  createFormValuesWithName,
  createSelectedIDWithName,
  createTableFiltersWithName
} from './commonReducers';
import { pickBy, map, keyBy, find, filter } from 'lodash';

export function manageCustomerAndFacilityReducer(
  state: { [key: string]: Icustomer } = initialState.manageCustomerAndFacility
    .data,
  action: any
) {
  switch (action.type) {
    case types.GET_CUSTOMERS_AND_FACILITY_SUCCESS:
      const customers = map(action.payload, (customer: Icustomer) => {
        return cleanObject(customer);
      });

      return keyBy(customers, 'id');
    case types.CUSTOMER_UPDATE_SUCCESS:
      return {
        ...state,
        [action.customer.id]: cleanObject({
          ...state[action.customer.id],
          ...action.customer
        })
      };
    case types.FACILITY_UPDATE_SUCCESS:
      const oldCustomer = { ...state[action.facility.customerID] };
      const oldFacility = {
        ...find(oldCustomer.facilities, f => f.id === action.facility.id)
      };
      const facilities = [
        ...filter(oldCustomer.facilities, f => f.id !== action.facility.id)
      ];
      oldCustomer.facilities = [
        ...facilities,
        { ...oldFacility, ...action.facility }
      ];
      return { ...state, [action.facility.customerID]: { ...oldCustomer } };
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

export default function manageCustomerAndFacility(
  state: ImanageCustomerAndFacilityReducer = initialState.manageCustomerAndFacility,
  action: any
) {
  return {
    data: manageCustomerAndFacilityReducer(state.data, action),
    totalPages: manageTotalPages(state.totalPages, action),
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
