import * as types from '../actions/actionTypes';
import { IqueueObject, IuserQueue } from '../models';
import initialState from './initialState';
import { pickBy, map, filter } from 'lodash';

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

function userQueuePage(state: number = 1, action: any): number {
  switch (action.type) {
    case types.USER_QUEUE_INCREMENT:
      return state + 1;
    case types.USER_QUEUE_DECREMENT:
      if (state > 1) {
        return state - 1;
      }
    case types.USER_LOGOUT_SUCCESS:
      return 1;
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
  state: IuserQueue = initialState.userQueue,
  action: any
) {
  return {
    data: userQueueData(state.data, action),
    page: userQueuePage(state.page, action),
    totalPages: userQueueTotalPages(state.totalPages, action)
  };
}
