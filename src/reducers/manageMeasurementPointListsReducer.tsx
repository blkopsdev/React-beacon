import { keyBy, map, forEach } from 'lodash';

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
import initialState, { initialMeasurementPoint } from './initialState';
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
      const measurementPointLists = action.measurementPointLists.map(
        (measurementPointList: ImeasurementPointList) => {
          const measurementPointTabs = keyMeasurementPoints(
            measurementPointList.measurementPointTabs
          );

          return { ...measurementPointList, measurementPointTabs };
        }
      );
      // const filteredList = measurementPointLists.filter(
      //   (list: ImeasurementPointList) => list.measurementPointTabs.length > 1
      // ); // TODO temporary workaround for duplicate lists
      return keyBy(measurementPointLists, 'id');
    case types.MANAGE_MEASUREMENT_POINT_LIST_ADD:
      return {
        ...state,
        [action.measurementPointList.id]: action.measurementPointList
      };
    case types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE:
      if (action.persistToAPI === false) {
        return state;
      }
      return {
        ...state,
        [action.measurementPointList.id]: action.measurementPointList
      };
    // case types.MANAGE_MEASUREMENT_POINT_ADD:
    //   const newTabs = state[action.listID].measurementPointTabs.map(tab => {
    //     if (tab.id === action.tabID) {
    //       return {
    //         ...tab,
    //         measurementPoints: {
    //           ...tab.measurementPoints,
    //           [action.measurementPoint.id]: action.measurementPoint
    //         }
    //       };
    //     } else {
    //       return tab;
    //     }
    //   });
    //   return {
    //     ...state,
    //     [action.listID]: {
    //       ...state[action.listID],
    //       measurementPointTabs: newTabs
    //     }
    //   };
    case types.MEASUREMENT_POINT_LIST_SUCCESS:
      const tabs: ImeasurementPointListTab[] = action.list.measurementPointTabs;
      return {
        ...state,
        [action.list.id]: {
          ...action.list,
          measurementPointTabs: keyMeasurementPoints(tabs)
        }
      };
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}

const measurementPointsByIDReducer = (
  state: { [key: string]: ImeasurementPoint } = {},
  action: any
): { [key: string]: ImeasurementPoint } => {
  switch (action.type) {
    case types.MANAGE_MEASUREMENT_POINT_LISTS_SUCCESS:
      // const measurmentPointLists = initialState.measurementPointLists.data;
      const measurmentPointLists = action.allLists;
      let measurementPoints = {};
      forEach(measurmentPointLists, (list: ImeasurementPointList) => {
        forEach(list.measurementPointTabs, (tab: ImeasurementPointListTab) => {
          measurementPoints = {
            ...measurementPoints,
            ...keyBy(tab.measurementPoints, (mp: ImeasurementPoint) => mp.id)
          };
        });
      });
      return measurementPoints;
    case types.MEASUREMENT_POINT_LIST_SUCCESS:
      let measurementPointsB = {};
      forEach(
        action.list.measurementPointTabs,
        (tab: ImeasurementPointListTab) => {
          measurementPointsB = {
            ...measurementPointsB,
            ...keyBy(tab.measurementPoints, (mp: ImeasurementPoint) => mp.id)
          };
        }
      );
      // not using: {...state, ...measurmentPointsB} because we can simiply replace state for now because we always get new from ther server
      return measurementPointsB;
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
};

function manageSelectedMeasurementPointList(
  state: ImeasurementPointList = initialMeasurementPointList,
  action: any
): ImeasurementPointList {
  switch (action.type) {
    case types.SELECT_MEASUREMENT_POINT_LIST:
      return action.measurementPointList;
    case types.MANAGE_MEASUREMENT_POINT_SAVE_TO_LIST:
      const selectedTab = state.measurementPointTabs.find(
        tab => tab.id === action.selectedTabID
      );
      if (selectedTab) {
        const newTabs = state.measurementPointTabs.map(tab => {
          if (tab.id === selectedTab.id) {
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
        return { ...state, measurementPointTabs: newTabs };
      } else {
        console.error(
          'unable to update measurement point, missing tab' +
            action.selectedTabID
        );
        return state;
      }
    case types.MANAGE_MEASUREMENT_POINT_TAB_UPDATE:
      const currentTab = state.measurementPointTabs.find(
        tab => tab.id === action.tab.id
      );
      if (currentTab) {
        const newTabs = state.measurementPointTabs.map(tab => {
          if (tab.id === currentTab.id) {
            return {
              ...action.tab
            };
          } else {
            return tab;
          }
        });
        return { ...state, measurementPointTabs: newTabs };
      } else {
        console.error(
          'unable to update measurement point list tab, missing tab' +
            action.tab.id
        );
        return state;
      }

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
const selectedTabIDReducer = (state: string = '', action: any): string => {
  switch (action.type) {
    case types.MANAGE_MEASUREMENT_POINT_SET_SELECTED_TAB:
      return action.selectedTabID;
    case types.USER_LOGOUT_SUCCESS:
      return '';
    default:
      return state;
  }
};

const selectedMeasurementPointReducer = (
  state: ImeasurementPoint = initialMeasurementPoint,
  action: any
): ImeasurementPoint => {
  switch (action.type) {
    case types.MANAGE_MEASUREMENT_POINT_UPDATE:
      return action.measurementPoint;
    case types.USER_LOGOUT_SUCCESS:
      return initialMeasurementPoint;
    default:
      return state;
  }
};
export default function manageMeasurementPointLists(
  state: ImanageMeasurementPointListsReducer = initialState.manageMeasurementPointLists,
  action: any
) {
  return {
    data: manageMeasurementPointListData(state.data, action),
    measurementPointsByID: measurementPointsByIDReducer(
      state.measurementPointsByID,
      action
    ),
    totalPages: manageMeasurementPointListTotalPages(state.totalPages, action),
    selectedTabID: selectedTabIDReducer(state.selectedTabID, action),
    selectedMeasurementPointList: manageSelectedMeasurementPointList(
      state.selectedMeasurementPointList,
      action
    ),
    selectedMeasurementPoint: selectedMeasurementPointReducer(
      state.selectedMeasurementPoint,
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
    showEditMeasurementPointTabModal: modalToggleWithName(
      state.showEditMeasurementPointTabModal,
      action,
      'EDIT_MEASUREMENT_POINT_TAB'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_MEASUREMENT_POINT_LISTS'
    ),
    showEditMeasurementPointListTestProceduresModal: modalToggleWithName(
      state.showEditMeasurementPointListTestProceduresModal,
      action,
      'EDIT_MEASUREMENT_POINT_LIST_TEST_PROCEDURES'
    )
  };
}

const keyMeasurementPoints = (
  measurementPointTabs: ImeasurementPointListTab[]
) => {
  return map(measurementPointTabs, (tab: ImeasurementPointListTab) => {
    const measurementPointsKeyed = keyBy(
      tab.measurementPoints,
      (item: ImeasurementPoint) => item.id
    );
    return { ...tab, measurementPoints: measurementPointsKeyed };
  });
};
