import initialState from './initialState';
import * as types from '../actions/actionTypes';
import { Icustomer, ImanageCustomerAndFacilityReducer } from '../models';
import {
  createFormValuesWithName,
  createSelectedIDWithName,
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import { pickBy, map, keyBy, filter, find } from 'lodash';
import { FACILITY_UPDATE_SUCCESS } from '../actions/actionTypes';

export function manageCustomerAndFacilityReducer(
  state: { [key: string]: Icustomer } = {},
  action: any
) {
  switch (action.type) {
    case types.GET_CUSTOMERS_AND_FACILITY_SUCCESS:
      const newCustomer = map(action.payload.result, (customer: Icustomer) => {
        return cleanObject(customer);
      });
      return keyBy(newCustomer, 'id');
    case types.CUSTOMER_UPDATE_SUCCESS:
      const customersFiltered = filter(state, c => c.id !== action.customerID);
      const updatedCustomer = pickBy(
        action.customer,
        (property, key) => property !== null
      );
      return [
        ...customersFiltered,
        {
          ...updatedCustomer
        }
      ] as Icustomer[];
    case FACILITY_UPDATE_SUCCESS:
      const item: any = {
        ...find(state, c => c.id === action.facility.customerID)
      };
      const items = { ...state };
      try {
        const facilities = filter(
          item.facilities,
          c => c.id !== action.facilityID
        );
        const updatedFacility = pickBy(
          action.facility,
          (property, key) => property !== null
        );
        item['facilities'] = [...facilities, updatedFacility];
        items[item.id] = item;
      } catch (e) {
        console.log(e);
      }

      return items;
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
      'CUSTOMER_AND_FACILITY_ID'
    ),
    selectedFacilityID: createSelectedIDWithName(
      state.selectedFacilityID,
      action,
      'FACILITY_ID'
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
