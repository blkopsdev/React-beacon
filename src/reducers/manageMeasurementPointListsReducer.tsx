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
import { initialMeasurementPointList } from './initialState';
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
    case types.MANAGE_MEASUREMENT_POINT_LIST_ADD_SUCCESS:
      if (action.measurementPointList.measurementPoints) {
        action.measurementPointList.measurementPoints = keyBy(
          action.measurementPointList.measurementPoints,
          (item: ImeasurementPointQuestion) => item.id
        );
      } else {
        action.measurementPointList.measurementPoints = {};
      }
      return [...state, action.measurementPointList];
    case types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE_SUCCESS:
      if (action.measurementPointList.measurementPoints) {
        action.measurementPointList.measurementPoints = keyBy(
          action.measurementPointList.measurementPoints,
          (item: ImeasurementPointQuestion) => item.id
        );
      } else {
        action.measurementPointList.measurementPoints = {};
      }
      return [
        ...state.filter(l => l.id !== action.measurementPointList.id),
        action.measurementPointList
      ];
    case types.MANAGE_MEASUREMENT_POINT_LIST_DELETE_SUCCESS:
      return [...state.filter(l => l.id !== action.measurementPointListId)];
    case types.MANAGE_MEASUREMENT_POINT_QUESTION_ADD:
      // Grab the correct list
      let mpl = find(
        state,
        (l: ImeasurementPointList) => l.id === action.list.id
      );
      if (!mpl) {
        return state;
      }
      // Add/Update the question
      const q = keyBy(
        [action.question],
        (item: ImeasurementPointQuestion) => item.id
      );
      const measurementPoints = { ...mpl.measurementPoints, ...q };
      mpl = { ...mpl, measurementPoints };
      // Update the array with updated list and return
      return [...state.filter(l => l.id !== action.list.id), mpl];
    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function manageSelectedMeasurementPointList(
  state: ImeasurementPointList = initialMeasurementPointList,
  action: any
): ImeasurementPointList {
  switch (action.type) {
    case types.SELECT_MEASUREMENT_POINT_LIST:
      return action.measurementPointList;
    case types.MANAGE_MEASUREMENT_POINT_QUESTION_ADD:
      // Add/Update the question
      const q = keyBy(
        [action.question],
        (item: ImeasurementPointQuestion) => item.id
      );
      const measurementPoints = { ...state.measurementPoints, ...q };
      return { ...state, measurementPoints };
    case types.USER_LOGOUT_SUCCESS:
      return initialMeasurementPointList;
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
    selectedMeasurementPointList: manageSelectedMeasurementPointList(
      state.selectedMeasurementPointList,
      action
    ),
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
