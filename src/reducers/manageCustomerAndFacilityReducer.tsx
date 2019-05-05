import initialState from './initialState';
import * as types from '../actions/actionTypes';
import { Icustomer, ImanageCustomerAndFacilityReducer } from '../models';
import {
  createSelectedIDWithName,
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import { pickBy, map, keyBy } from 'lodash';

export function manageCustomerAndFacilityReducer(
  state: { [key: string]: Icustomer } = {},
  action: any
) {
  switch (action.type) {
    case types.GET_CUSTOMERS_AND_FACILITY_SUCCESS:
      const newCustomer = map(action.payload, (customer: Icustomer) => {
        customer['facilities'] = [
          {
            id: '1',
            name: 'faciliti name',
            customerID: customer.id,
            address: '',
            address2: '',
            city: '',
            state: '',
            postalCode: '',
            buildings: [],
            isDeleted: false
          }
        ];
        return cleanObject(customer);
      });
      return keyBy(newCustomer, 'id');
    case types.ADD_CUSTOMERS_AND_FACILITY_SUCCESS:
      return { ...state, [action.payload.id]: action.payload };
    case types.EDIT_CUSTOMERS_AND_FACILITY_SUCCESS:
      return { ...state, [action.payload.id]: action.payload };
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
    selectedCustomerID: createSelectedIDWithName(
      state.selectedCustomerAndFacilityID,
      action,
      'CUSTOMER_AND_FACILITY_ID'
    ),
    showEditBrandModal: modalToggleWithName(
      state.showEditCustomerAndFacilityModal,
      action,
      'EDIT_CUSTOMER_AND_FACILITY'
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
