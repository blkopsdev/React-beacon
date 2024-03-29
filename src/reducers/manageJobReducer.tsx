import { pickBy, map } from 'lodash';

import { Ijob, ImanageJobReducer, Iuser } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';

function jobManageData(state: Ijob[] = [], action: any): Ijob[] {
  switch (action.type) {
    case types.JOB_MANAGE_SUCCESS:
      return action.jobs;
    case types.JOB_ADD_SUCCESS:
      return [...state, action.job];
    case types.JOB_UPDATE_SUCCESS:
      return map(state, (job: Ijob) => {
        if (job.id === action.job.id) {
          return {
            ...pickBy(action.job, (property, key) => property !== null)
          } as Ijob;
        } else {
          return job;
        }
      });
    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function jobManageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.JOB_MANAGE_TOTAL_PAGES:
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

function jobTypes(state: any[] = [], action: any): any[] {
  switch (action.type) {
    case types.GET_JOBTYPES_SUCCESS:
      return action.jobTypes;
    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function fseUsers(state: Iuser[] = [], action: any): Iuser[] {
  switch (action.type) {
    case types.GET_FSE_SUCCESS:
      return action.users;
    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

export default function jobManage(
  state: ImanageJobReducer = initialState.manageJob,
  action: any
) {
  return {
    data: jobManageData(state.data, action),
    jobTypes: jobTypes(state.jobTypes, action),
    fseUsers: fseUsers(state.fseUsers, action),
    totalPages: jobManageTotalPages(state.totalPages, action),
    showEditJobModal: modalToggleWithName(
      state.showEditJobModal,
      action,
      'EDIT_JOB'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_JOB'
    )
  };
}
