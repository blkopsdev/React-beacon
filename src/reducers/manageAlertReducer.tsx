import initialState from './initialState';
import * as types from '../actions/actionTypes';
import { IAlert, ImanageAlertReducer } from '../models';
import {
  createSelectedIDWithName,
  createTableFiltersWithName,
  modalToggleWithName,
  createFormValuesWithName
} from './commonReducers';
import { pickBy, map, keyBy } from 'lodash';

export function manageAlertReducer(
  state: { [key: string]: IAlert } = {},
  action: any
) {
  switch (action.type) {
    case types.LOAD_ALERTS_SUCCESS:
      const newAlerts = map(action.payload, (alert: IAlert) => {
        return cleanAlertObject(alert);
      });
      return keyBy(newAlerts, 'id');
    case types.ADD_ALERT_SUCCESS:
      return { ...state, [action.payload.id]: action.payload };
    case types.EDIT_ALERT_SUCCESS:
      return { ...state, [action.payload.id]: action.payload };
    case types.REMOVE_ALERT_SUCCESS:
      const data = { ...state };
      delete data[action.payload.id];
      return data;
    default:
      return state;
  }
}

function alertManageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.ALERT_MANAGE_TOTAL_PAGES:
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

export default function manageAlert(
  state: ImanageAlertReducer = initialState.manageAlert,
  action: any
) {
  return {
    data: manageAlertReducer(state.data, action),
    totalPages: alertManageTotalPages(state.totalPages, action),
    selectedAlertID: createSelectedIDWithName(
      state.selectedAlertID,
      action,
      'ALERT_ID'
    ),
    showEditAlertModal: modalToggleWithName(
      state.showEditAlertModal,
      action,
      'EDIT_ALERT'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_ALERT'
    ),
    alertFormValues: createFormValuesWithName(
      state.alertFormValues,
      action,
      'MANAGE_ALERT'
    )
  };
}

const cleanAlertObject = (alert: IAlert) => {
  return {
    ...pickBy(alert, property => property !== null)
  } as IAlert;
};
