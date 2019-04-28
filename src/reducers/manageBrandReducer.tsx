import initialState from './initialState';
import * as types from '../actions/actionTypes';
import { Ibrand, ImanageBrandReducer } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';

export function manageBrandReducer(state: Ibrand[], action: any) {
  switch (action.type) {
    case types.LOAD_BRANDS_SUCCESS:
      return action.payload.result;
    case types.ADD_BRAND_SUCCESS:
      const list = [...state];
      list.push(action.payload);

      return list;
    case types.EDIT_BRAND_SUCCESS:
      return state.map((brand: any) => {
        if (brand.id === action.payload.id) {
          return action.payload;
        } else {
          return brand;
        }
      });
    case types.REMOVE_BRAND_SUCCESS:
      return state.filter((brand: any) => brand.id !== action.payload.id);
    default:
      return state;
  }
}

function brandManageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.BRAND_MANAGE_TOTAL_PAGES:
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

export default function brandManage(
  state: ImanageBrandReducer = initialState.manageBrand,
  action: any
) {
  return {
    brandList: manageBrandReducer(state.brandList, action),
    totalPages: brandManageTotalPages(state.totalPages, action),
    showEditBrandModal: modalToggleWithName(
      state.showEditBrandModal,
      action,
      'EDIT_BRAND'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_BRAND'
    )
  };
}
