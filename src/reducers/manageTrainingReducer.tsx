import { ImanageTrainingProgress, ImanageTrainingReducer } from '../models';
import { createTableFiltersWithName } from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';

function manageTrainingData(
  state: ImanageTrainingProgress[] = initialState.manageTraining.data,
  action: any
): ImanageTrainingProgress[] {
  switch (action.type) {
    case types.MANAGE_TRAINING_SUCCESS:
      return action.trainingProgress;
    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function manageTrainingTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.MANAGE_TRAINING_TOTAL_PAGES:
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

export default function manageTraining(
  state: ImanageTrainingReducer = initialState.manageTraining,
  action: any
) {
  return {
    data: manageTrainingData(state.data, action),
    totalPages: manageTrainingTotalPages(state.totalPages, action),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_TRAINING'
    )
  };
}
