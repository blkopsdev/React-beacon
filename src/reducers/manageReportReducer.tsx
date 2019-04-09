import { pickBy, map } from 'lodash';

import { Ireport, ImanageReportReducer, IdefaultReport } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState, { initialReport } from './initialState';
import * as types from '../actions/actionTypes';
import { keyBy } from 'lodash';

/*
* defaultReports are received from the API and never updated client side
*/
function manageDataReducer(
  state: { [key: string]: IdefaultReport } = {},
  action: any
): { [key: string]: IdefaultReport } {
  switch (action.type) {
    case types.REPORT_MANAGE_GET_DEFAULT_SUCCESS:
      const newData = map(action.reports, (defaultReport: IdefaultReport) => {
        return cleanDefaultReportObject(defaultReport);
      });
      return keyBy(newData, 'id');
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}

/*
* use this reducer if and when we do CRUD for reports
* when we do, don't forget to update the selectedReport with what is received
*/
// function manageDataReducer(
//   state: { [key: string]: Ireport } = {},
//   action: any
// ): { [key: string]: Ireport } {
//   switch (action.type) {
//     case types.REPORT_MANAGE_SUCCESS:
//       const newData = map(action.reports, (report: Ireport) => {
//         return cleanDefaultReportObject(report);
//       });
//       return keyBy(newData, 'id');

//     case types.REPORT_ADD_SUCCESS:
//       return { ...state, [action.report.id]: action.report };
//     case types.REPORT_UPDATE_SUCCESS:
//       return { ...state, [action.report.id]: cleanDefaultReportObject(action.report) };
//     case types.USER_LOGOUT_SUCCESS:
//       return {};
//     default:
//       return state;
//   }
// }

function reportManageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.REPORT_MANAGE_TOTAL_PAGES:
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

function selectedReportReducer(
  state: Ireport = initialReport,
  action: any
): Ireport | any {
  switch (action.type) {
    case types.SET_SELECTED_REPORT:
      return action.job as Ireport;
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}

/*
* selected default report id reducer
* TODO refactor this and historicalResultIDReducer into a common reducer that simply stores a string
*/
const selectedDefaultReportIDReducer = (
  state: string = '',
  action: any
): string => {
  switch (action.type) {
    case types.SET_SELECTED_DEFAULT_REPORT_ID:
      return action.defaultReportID;
    case types.CLEAR_SELECTED_DEFAULT_REPORT_ID:
      return '';
    case types.USER_LOGOUT_SUCCESS:
      return '';
    default:
      return state;
  }
};

export const manageReportReducer = (
  state: ImanageReportReducer = initialState.manageReport,
  action: any
) => {
  return {
    defaultReportsByID: manageDataReducer(state.defaultReportsByID, action),
    totalPages: reportManageTotalPages(state.totalPages, action),
    showEditReportModal: modalToggleWithName(
      state.showEditReportModal,
      action,
      'EDIT_REPORT'
    ),
    selectedReport: selectedReportReducer(state.selectedReport, action),
    selectedDefaultReportID: selectedDefaultReportIDReducer(
      state.selectedDefaultReportID,
      action
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_REPORT'
    )
  };
};

const cleanDefaultReportObject = (defaultReport: IdefaultReport) => {
  return {
    ...pickBy(defaultReport, (property, key) => property !== null)
  } as IdefaultReport;
};
