import { keyBy, map } from 'lodash';

import {
  ImanageMeasurementPointListsReducer,
  ImeasurementPointList,
  ImeasurementPoint,
  ImeasurementPointListTab
} from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState from './initialState';
import { initialMeasurementPointList } from './initialState';
import * as types from '../actions/actionTypes';

/*
* data - keyed by the measurementPointListID
*/

function manageMeasurementPointListData(
  state: { [key: string]: ImeasurementPointList } = {},
  action: any
): { [key: string]: ImeasurementPointList } {
  switch (action.type) {
    case types.MANAGE_MEASUREMENT_POINT_LISTS_SUCCESS:
      // return initialState.measurementPointLists.data;
      const measurementPointLists = action.measurements.map(
        (measurementPointList: ImeasurementPointList) => {
          const measurementPointTabs = map(
            measurementPointList.measurementPointTabs,
            (tab: ImeasurementPointListTab) => {
              const measurementPointsKeyed = keyBy(
                tab.measurementPoints,
                (item: ImeasurementPoint) => item.id
              );
              return { ...tab, measurementPoints: measurementPointsKeyed };
            }
          );

          return { ...measurementPointList, measurementPointTabs };
        }
      );
      // const filteredList = measurementPointLists.filter(
      //   (list: ImeasurementPointList) => list.measurementPointTabs.length > 1
      // ); // TODO temporary workaround for duplicate lists
      return keyBy(
        measurementPointLists,
        (mplK: ImeasurementPointList) => mplK.id
      );
    case types.MANAGE_MEASUREMENT_POINT_LIST_ADD:
      return {
        ...state,
        [action.measurementPointList.id]: action.measurementPointList
      };
    case types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE:
      return {
        ...state,
        [action.measurementPointList.id]: action.measurementPointList
      };
    case types.MANAGE_MEASUREMENT_POINT_ADD:
      const newTabs = state[action.listID].measurementPointTabs.map(tab => {
        if (tab.id === action.tabID) {
          return {
            ...tab,
            measurementPoints: {
              ...tab.measurementPoints,
              [action.measurementPoint.id]: action.measurementPoint
            }
          };
        } else {
          return tab;
        }
      });
      return {
        ...state,
        [action.listID]: {
          ...state[action.listID],
          measurementPointTabs: newTabs
        }
      };
    case types.USER_LOGOUT_SUCCESS:
      return {};
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
    case types.MANAGE_MEASUREMENT_POINT_ADD:
      const newTabsB = state.measurementPointTabs.map(tab => {
        if (tab.id === action.tabID) {
          return {
            ...tab,
            measurementPoints: {
              ...tab.measurementPoints,
              [action.measurementPoint.id]: action.measurementPoint
            }
          };
        } else {
          return tab;
        }
      });
      return {
        ...state,
        measurementPointTabs: newTabsB
      };
    case types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE:
      return action.measurementPointList;
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
const selectedTabIDReducer = (state: string, action: any): string => {
  switch (action.type) {
    case types.MANAGE_MEASUREMENT_POINT_SET_SELECTED_TAB:
      return action.selectedTabID;
    case types.USER_LOGOUT_SUCCESS:
      return '';
    default:
      return state;
  }
};
export default function manageMeasurementPointLists(
  state: ImanageMeasurementPointListsReducer = initialState.manageMeasurementPointListsReducer,
  action: any
) {
  return {
    data: manageMeasurementPointListData(state.data, action),
    totalPages: manageMeasurementPointListTotalPages(state.totalPages, action),
    selectedTabID: selectedTabIDReducer(state.selectedTabID, action),
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
      'EDIT_MEASUREMENT_POINT'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_MEASUREMENT_POINT_LISTS'
    )
  };
}
