import { ItableFilters } from '../models';
import { initialTableFilters } from './initialState';
import * as types from '../actions/actionTypes';

export function createShowModalWithNamedType(modalName = '') {
  return function modalToggle(state: boolean = false, action: any) {
    switch (action.type) {
      case `TOGGLE_MODAL_${modalName}`:
        return !state;
      case types.CLOSE_ALL_MODALS:
        return false;
      default:
        return state;
    }
  };
}

export function modalToggleWithName(
  state: boolean = false,
  action: any,
  modalName: string
) {
  switch (action.type) {
    case `TOGGLE_MODAL_${modalName}`:
      return !state;
    case types.CLOSE_ALL_MODALS:
      return false;
    default:
      return state;
  }
}

export function createTableFiltersWithName(
  state: ItableFilters = initialTableFilters,
  action: any,
  tableName: string
) {
  switch (action.type) {
    case `SET_TABLE_FILTER_${tableName}`:
      return { ...state, ...action.filters } as ItableFilters;
    default:
      return state;
  }
}
