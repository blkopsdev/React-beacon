import * as types from '../actions/actionTypes';
import { Iuser } from '../models';
import initialState from './initialState';

export default function user(state: Iuser = initialState.user, action: any) {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      // return {
      //   ...action.user,
      //   isAuthenticated: true,
      //   token: state.token
      // } as Iuser;
      return { ...state, ...action.user } as Iuser;
    case types.AAD_LOGIN_SUCCESS:
      return Object.assign({}, state, { token: action.token });
    case types.USER_LOGOUT_SUCCESS:
      return initialState.user;
    default:
      return state;
  }
}
