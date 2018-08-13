import * as types from '../actions/actionTypes';
import { IqueueUser } from '../models';
// import initialState from './initialState';
import { pickBy, map, filter } from 'lodash';

export default function userQueue(state: IqueueUser[] = [], action: any) {
  switch (action.type) {
    case types.USER_QUEUE_SUCCESS:
      return map(action.queue, queueObject => {
        return {
          ...queueObject,
          user: pickBy(queueObject.user, (property, key) => property !== null)
        };
      });
    // return [...action.queue];
    // return [...state, ...action.queue];
    // return Object.assign(
    //   {},
    //   state,
    //   keyBy(action.queue, (user: Iuser) => user.id)
    // ) as IuserQueue;
    case types.USER_UPDATE_SUCCESS:
      const queuefilterUser = filter(state, u => u.id !== action.queueID);
      const newQueueObject = {
        id: action.queueID,
        user: pickBy(action.user, (property, key) => property !== null)
      };

      return [...queuefilterUser, newQueueObject];
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
