import { pickBy, map, filter } from 'lodash';

import { IqueueObject, ImanageUserQueueReducer } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';

function userQueueData(
  state: IqueueObject[] = [],
  action: any
): IqueueObject[] {
  switch (action.type) {
    case types.USER_QUEUE_SUCCESS:
      return map(action.queue, queueObject => {
        return {
          id: queueObject.id,
          user: {
            ...initialState.user,
            ...pickBy(queueObject.user, (property, key) => property !== null)
          }
        };
      });
    case types.USER_QUEUE_UPDATE_SUCCESS:
      const queuefilterUser = filter(state, u => u.id !== action.queueID);
      const newQueueObject = {
        id: action.queueID,
        user: {
          ...initialState.user,
          ...pickBy(action.user, (property, key) => property !== null)
        }
      };

      return [...queuefilterUser, newQueueObject] as IqueueObject[];
    case types.USER_APPROVE_SUCCESS:
      return filter(state, u => u.id !== action.userQueueID);
    case types.USER_REJECT_SUCCESS:
      return filter(state, u => u.id !== action.userQueueID);

    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function userQueueTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.USER_QUEUE_TOTAL_PAGES:
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

export default function userQueue(
  state: ImanageUserQueueReducer = initialState.manageUserQueue,
  action: any
) {
  return {
    data: userQueueData(state.data, action),
    totalPages: userQueueTotalPages(state.totalPages, action),
    showEditQueueUserModal: modalToggleWithName(
      state.showEditQueueUserModal,
      action,
      'EDIT_QUEUE_USER'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_USER_QUEUE'
    )
  };
}
