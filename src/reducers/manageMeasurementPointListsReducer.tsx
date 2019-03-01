import { find, keyBy, filter } from 'lodash';

import {
  ImanageMeasurementPointListsReducer,
  ImeasurementPointList,
  ImeasurementPoint
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
            (item: ImeasurementPoint) => item.id
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
          (item: ImeasurementPoint) => item.id
        );
      } else {
        action.measurementPointList.measurementPoints = {};
      }
      return [...state, action.measurementPointList];
    case types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE_SUCCESS:
      if (action.measurementPointList.measurementPoints) {
        action.measurementPointList.measurementPoints = keyBy(
          action.measurementPointList.measurementPoints,
          (item: ImeasurementPoint) => item.id
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
      const q = keyBy([action.question], (item: ImeasurementPoint) => item.id);
      const measurementPoints = { ...mpl.measurementPoints, ...q };
      mpl = { ...mpl, measurementPoints };
      // Update the array with updated list and return
      return [...state.filter(l => l.id !== action.list.id), mpl];
    case types.MANAGE_MEASUREMENT_POINT_QUESTION_DELETE_SUCCESS:
      // Grab the correct list
      const mplToMod = find(
        state,
        (l: ImeasurementPointList) => l.id === action.measurementPointListId
      );
      if (!mplToMod) {
        return state;
      }
      // Delete the question
      // Update the array with updated list and return
      return [
        ...state.filter(l => l.id !== action.measurementPointListId),
        {
          ...mplToMod,
          measurementPoints: keyBy(
            filter(mplToMod.measurementPoints, mp => {
              return mp.id !== action.measurementPointId;
            }),
            (item: ImeasurementPoint) => item.id
          )
        }
      ];
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
      const q = keyBy([action.question], (item: ImeasurementPoint) => item.id);
      const measurementPoints = { ...state.measurementPoints, ...q };
      return { ...state, measurementPoints };
    case types.MANAGE_MEASUREMENT_POINT_QUESTION_DELETE_SUCCESS:
      if (action.measurementPointListId !== state.id) {
        return state;
      }
      // Delete the question
      // Update the array with updated list and return
      return {
        ...state,
        measurementPoints: keyBy(
          filter(state.measurementPoints, mp => {
            return mp.id !== action.measurementPointId;
          }),
          (item: ImeasurementPoint) => item.id
        )
      };
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
    showEditMeasurementPointModal: modalToggleWithName(
      state.showEditMeasurementPointModal,
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
