// import { pickBy, map } from 'lodash';

import {
  ImanageMeasurementPointListsReducer,
  ImeasurementPointList
} from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';

function manageMeasurementPointListData(
  state: ImeasurementPointList[] = [],
  action: any
): ImeasurementPointList[] {
  switch (action.type) {
    case types.MANAGE_MEASUREMENT_POINT_LISTS_SUCCESS:
      return action.measurements;
    // case types.MEASUREMENTS_ADD_SUCCESS:
    //   return [...state, action.measurement];
    // case types.MEASUREMENTS_UPDATE_SUCCESS:
    //   return map(state, (job: Ijob) => {
    //     if (job.id === action.job.id) {
    //       return {
    //         ...pickBy(action.job, (property, key) => property !== null)
    //       } as Ijob;
    //     } else {
    //       return job;
    //     }
    //   });
    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function manageMeasurementPointListTotalPages(
  state: number = 1,
  action: any
): number {
  switch (action.type) {
    case types.MANAGE_MEASUREMENT_POINT_LISTS_TOTAL_PAGES:
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

export default function manageMeasurementPointLists(
  state: ImanageMeasurementPointListsReducer = initialState.manageMeasurementPointLists,
  action: any
) {
  return {
    data: manageMeasurementPointListData(state.data, action),
    totalPages: manageMeasurementPointListTotalPages(state.totalPages, action),
    showEditMeasurementPointListModal: modalToggleWithName(
      state.showEditMeasurementPointListModal,
      action,
      'EDIT_MEASUREMENT_POINT_LISTS'
    ),
    showEditMeasurementPointQuestionModal: modalToggleWithName(
      state.showEditMeasurementPointQuestionModal,
      action,
      'EDIT_MEASUREMENT_POINT_QUESTION'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_MEASUREMENT_POINT_LISTS'
    )
  };
}
