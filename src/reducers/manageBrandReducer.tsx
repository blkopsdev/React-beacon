import initialState, { initialBrand } from './initialState';
import * as types from '../actions/actionTypes';
import { Ibrand, ImanageBrandReducer } from '../models';
import {
  createSelectedIDWithName,
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import { pickBy, map, keyBy } from 'lodash';

export function manageBrandReducer(
  state: { [key: string]: Ibrand } = {},
  action: any
) {
  switch (action.type) {
    case types.LOAD_BRANDS_SUCCESS:
      const newBrands = map(action.payload.result, (brand: Ibrand) => {
        return cleanBrandObject(brand);
      });
      return keyBy(newBrands, 'id');
    case types.ADD_BRAND_SUCCESS:
      return { ...state, [action.payload.id]: action.payload };
    case types.EDIT_BRAND_SUCCESS:
      return { ...state, [action.payload.id]: action.payload };
    case types.REMOVE_BRAND_SUCCESS:
      const data = { ...state };
      delete data[action.payload.id];
      return data;
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
    data: manageBrandReducer(state.data, action),
    totalPages: brandManageTotalPages(state.totalPages, action),
    selectedBrandID: createSelectedIDWithName(
      state.selectedBrandID,
      action,
      'BRAND_ID'
    ),
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

const cleanBrandObject = (brand: Ibrand) => {
  return {
    ...initialBrand,
    ...pickBy(brand, property => property !== null)
  } as Ibrand;
};
