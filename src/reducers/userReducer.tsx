import * as types from '../actions/actionTypes';
import { Iuser } from '../models';
import initalState from './initialState';


export default function user(state: Iuser = initalState.user, action: any) {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return {...action.user, isAuthenticated : true} as Iuser;
    default:
      return state;
  }
}