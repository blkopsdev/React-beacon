import * as types from '../actions/actionTypes';
import { IuserQueue, Iuser } from '../models';
// import initialState from './initialState';
import { keyBy } from 'lodash';

export default function userQueue(state: IuserQueue = {}, action: any) {
  switch (action.type) {
    case types.USER_QUEUE_SUCCESS:
      return Object.assign(
        {},
        state,
        keyBy(action.queue, (user: Iuser) => user.id)
      ) as IuserQueue;

    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}
