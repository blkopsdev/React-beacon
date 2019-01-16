import { find, keyBy } from 'lodash';

import {
  ImanageMeasurementPointListsReducer,
  ImeasurementPointList,
  ImeasurementPointQuestion
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
      return action.measurements.map((m: any) => {
        if (m.measurementPoints) {
          m.measurementPoints = keyBy(
            m.measurementPoints,
            (item: ImeasurementPointQuestion) => item.id
          );
        } else {
          m.measurementPoints = {};
        }
        return m;
      });
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
    case types.MANAGE_MEASUREMENT_POINT_QUESTION_ADD:
      // Grab the correct list
      // let mpl = find(
      //   state,
      //   (l: ImeasurementPointList) => l.id === action.list.id
      // );
      // if(!mpl) { return state; }
      // // Add/Update the question
      // const q = keyBy(
      //   [action.question],
      //   (item: ImeasurementPointQuestion) => item.id
      // );
      // const measurementPoints = { ...mpl.measurementPoints, q};
      // mpl = {...mpl, measurementPoints }
      return state;
    // Update the array with updated list and return
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
