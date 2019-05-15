import { ItableFiltersReducer } from '../models';
import { initialTableFilters } from './initialState';
import * as types from '../actions/actionTypes';

export function createShowModalWithNamedType(modalName = '') {
  return function modalToggle(state: boolean = false, action: any): boolean {
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
): boolean {
  switch (action.type) {
    case `TOGGLE_MODAL_${modalName}`:
      // console.error('toggle modal')
      return !state;
    case `SHOW_MODAL_${modalName}`:
      return true;
    case `HIDE_MODAL_${modalName}`:
      return false;
    case types.CLOSE_ALL_MODALS:
      return false;
    default:
      return state;
  }
}

export function createTableFiltersWithName(
  state: ItableFiltersReducer = initialTableFilters,
  action: any,
  tableName: string
): ItableFiltersReducer {
  switch (action.type) {
    case `SET_TABLE_FILTER_${tableName}`:
      return { ...state, ...action.filters } as ItableFiltersReducer;
    case types.USER_LOGOUT_SUCCESS:
      return initialTableFilters;
    default:
      return state;
  }
}

export function createFormValuesWithName(
  state: { [key: string]: any } = {},
  action: any,
  tableName: string
): { [key: string]: any } {
  switch (action.type) {
    case `SET_FORM_VALUES_${tableName}`:
      return { ...action.formValues };
    case `UPDATE_FORM_VALUES_${tableName}`:
      return { ...state, ...action.formValue };
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}

export function createSelectedIDWithName(
  state: string = '',
  action: any,
  name: string
): string {
  switch (action.type) {
    case `SET_SELECTED_${name}`:
      return action.id;
    case `CLEAR_SELECTED_${name}`:
      return '';
    case types.USER_LOGOUT_SUCCESS:
      return '';
    default:
      return state;
  }
}
