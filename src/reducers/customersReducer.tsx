import * as types from '../actions/actionTypes';
import { Icustomer } from '../models';
import initialState from './initialState';
import { pickBy, map, filter } from 'lodash';

export default function customers(
  state: Icustomer[] = initialState.customers,
  action: any
) {
  switch (action.type) {
    case types.GET_CUSTOMERS_SUCCESS:
      return map(action.customers, customer => {
        return pickBy(customer, (property, key) => property !== null);
      }) as Icustomer[];
    case types.CUSTOMER_UPDATE_SUCCESS:
      const customersFiltered = filter(state, c => c.id !== action.customerID);
      const updatedCustomer = pickBy(
        action.customer,
        (property, key) => property !== null
      );
      return [...customersFiltered, updatedCustomer] as Icustomer[];
    case types.USER_LOGOUT_SUCCESS:
      return initialState.customers;

    default:
      return state;
  }
}
