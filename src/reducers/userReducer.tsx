import * as types from '../actions/actionTypes';
import { Iuser } from '../models';
import initalState from './initialState';


export default function user(state: Iuser = initalState.user, action: any) {
  switch (action.type) {
    case types.BEGIN_AJAX_CALL:
    default:
      return state;
  }
}