import * as types from '../actions/actionTypes';
import { IqueueUser } from '../models';
// import initialState from './initialState';
import { filter } from 'lodash';

export default function userQueue(state: IqueueUser[] = [], action: any) {
  switch (action.type) {
    case types.USER_QUEUE_SUCCESS:
      return [...action.queue];
    // return [...state, ...action.queue];
    // return Object.assign(
    //   {},
    //   state,
    //   keyBy(action.queue, (user: Iuser) => user.id)
    // ) as IuserQueue;
    case types.USER_UPDATE_SUCCESS:
      const queuefilterUser = filter(state, u => u.id !== action.queueID);
      const newQueueObject = { id: action.queueID, user: action.user };

      return [...queuefilterUser, newQueueObject];
    case types.USER_APPROVE_SUCCESS:
      return filter(state, u => u.id !== action.userQueueID);
    case types.USER_REJECT_SUCCESS:
      return filter(state, u => u.id !== action.userQueueID);

    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}
