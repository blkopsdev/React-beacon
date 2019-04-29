import { pickBy, map } from 'lodash';

import { Ijob, ImanageJobReducer, Iuser } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName,
  createFormValuesWithName,
  createSelectedIDWithName
} from './commonReducers';
import initialState, { initialJob } from './initialState';
import * as types from '../actions/actionTypes';
import { keyBy } from 'lodash';

function jobManageData(
  state: { [key: string]: Ijob } = {},
  action: any
): { [key: string]: Ijob } {
  switch (action.type) {
    case types.JOB_MANAGE_SUCCESS:
      const newJobs = map(action.jobs, (job: Ijob) => {
        return cleanJobObject(job);
      });
      return keyBy(newJobs, 'id');

    case types.JOB_ADD_SUCCESS:
      return { ...state, [action.job.id]: action.job };
    case types.JOB_UPDATE_SUCCESS:
      return { ...state, [action.job.id]: cleanJobObject(action.job) };
    case types.USER_LOGOUT_SUCCESS:
      return {};
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
    fseUsers: fseUsers(state.fseUsers, action),
    totalPages: jobManageTotalPages(state.totalPages, action),
    jobFormValues: createFormValuesWithName(
      state.jobFormValues,
      action,
      'MANAGE_JOB'
    ),
    selectedJobID: createSelectedIDWithName(
      state.selectedJobID,
      action,
      'JOB_MANAGE_JOB'
    ),
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

const cleanJobObject = (job: Ijob) => {
  return {
    ...initialJob,
    ...pickBy(job, (property, key) => property !== null)
  } as Ijob;
};
