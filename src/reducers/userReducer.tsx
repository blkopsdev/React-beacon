import * as types from '../actions/actionTypes';
import { Iuser } from '../models';
import initalState from './initialState';

export default function user(state: Iuser = initalState.user, action: any) {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return {
        ...action.user,
        isAuthenticated: true,
        token: state.token
      } as Iuser;
    case types.AAD_LOGIN_SUCCESS:
      return Object.assign({}, state, { token: action.token });
    default:
      return state;
  }
}
