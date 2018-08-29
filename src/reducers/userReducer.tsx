import * as types from '../actions/actionTypes';
import { Iuser } from '../models';
import initialState from './initialState';
import { map, pickBy } from 'lodash';

export default function user(state: Iuser = initialState.user, action: any) {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      // return {
      //   ...action.user,
      //   isAuthenticated: true,
      //   token: state.token
      // } as Iuser;
      const securityFunctions = map(
        action.user.securityFunctions,
        securityF => {
          return securityF.toUpperCase();
        }
      );
      const cleanUser = pickBy(
        action.user,
        (property, key) => property !== null
      ); // get rid of null values
      // console.error('reducer data', state, action.user)
      return { ...state, ...cleanUser, securityFunctions } as Iuser;
    case types.AAD_LOGIN_SUCCESS:
      return Object.assign({}, state, { token: action.token });

    case types.USER_UPDATE_PROFILE_SUCCESS:
      const pickedUser = pickBy(
        action.user,
        (property, key) => property !== null
      ); // get rid of null values
      const securityFs = map(action.user.securityFunctions, securityF => {
        return securityF.toUpperCase();
      });
      return {
        ...state,
        ...pickedUser,
        securityFunctions: securityFs
      } as Iuser;

    case types.USER_LOGOUT_SUCCESS:
      return initialState.user;
    default:
      return state;
  }
}
