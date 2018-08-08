import * as types from '../actions/actionTypes';
import initialState from './initialState';
import { Iredirect } from '../models';

export default function redirect(
  state: Iredirect = initialState.redirect,
  action: any
) {
  switch (action.type) {
    case types.SET_REDIRECT_REFERRER:
      // return { ...state, redirectToReferrer: true } as Iredirect;
      return initialState.redirect;
    case types.REMOVE_REDIRECT_REFERRER:
      return { ...state, redirectToReferrer: false } as Iredirect;
    case types.SET_REDIRECT_PATHNAME:
      return { ...state, pathname: action.pathname } as Iredirect;
    case types.REMOVE_REDIRECT_REFERRER:
      return initialState.redirect;
    case types.USER_LOGOUT_SUCCESS:
      return initialState.redirect;

    default:
      return state;
  }
}
