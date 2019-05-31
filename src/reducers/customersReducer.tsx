import * as types from '../actions/actionTypes';
import { Icustomer } from '../models';
import initialState, { initialCustomer } from './initialState';
import { pickBy, map, keyBy, find, filter } from 'lodash';

export default function customers(
  state: { [key: string]: Icustomer } = initialState.customers,
  action: any
): { [key: string]: Icustomer } {
  switch (action.type) {
    case types.GET_CUSTOMERS_SUCCESS:
      const newCustomersWithoutFacilities = keyBy(
        map(action.customers, customer => {
          return cleanCustomerWithoutFacilities(customer);
        }),
        'id'
      );
      return { ...state, ...newCustomersWithoutFacilities };
    case types.GET_CUSTOMERS_AND_FACILITY_SUCCESS:
      const newCustomers = keyBy(
        map(action.payload, customer => {
          return cleanCustomer(customer);
        }),
        'id'
      );
      return { ...state, ...newCustomers };
    case types.CUSTOMER_UPDATE_SUCCESS:
      return {
        ...state,
        [action.customer.id]: cleanCustomer({
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
    case types.USER_LOGOUT_SUCCESS:
      return initialState.customers;
    default:
      return state;
  }
}

const cleanCustomer = (customer: Icustomer) => {
  return {
    ...initialCustomer,
    ...pickBy(customer, (property, key) => property !== null)
  };
};

const cleanCustomerWithoutFacilities = (customer: Icustomer) => {
  const { facilities, ...initialCustomerWithoutFacilities } = initialCustomer;
  return {
    ...initialCustomerWithoutFacilities,
    ...pickBy(customer, (property, key) => property !== null)
  };
};
