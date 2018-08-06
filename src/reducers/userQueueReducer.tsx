import * as types from '../actions/actionTypes';
import { IqueueUser } from '../models';
// import initialState from './initialState';
// import { keyBy } from 'lodash';

export default function userQueue(state: IqueueUser[] = [], action: any) {
  switch (action.type) {
    case types.USER_QUEUE_SUCCESS:
      return [...state, ...action.queue];
    // return Object.assign(
    //   {},
    //   state,
    //   keyBy(action.queue, (user: Iuser) => user.id)
    // ) as IuserQueue;
    case types.USER_UPDATE_SUCCESS:
      console.log(action.user);
      return state;

    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}
