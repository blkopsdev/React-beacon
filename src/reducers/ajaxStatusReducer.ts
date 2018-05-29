import * as types from '../actions/actionTypes';
import initalState from './initialState';

function actionTypeEndsInSuccess(type: string) {
  return type.substring(type.length - 8) === '_SUCCESS';
}

function actionTypeEndsInFailed(type: string) {
  return type.substring(type.length - 7) === '_FAILED';
}

export default function ajaxStatusReducer(state: number = initalState.ajaxCallsInProgress, action: any) {
  if (action.type === types.BEGIN_AJAX_CALL) {
    return state + 1;
  } else if (state >= 1 && (actionTypeEndsInSuccess(action.type) || actionTypeEndsInFailed(action.type))) {
    return state - 1;
  } else if(state >= 1 && action.type === types.END_AJAX_CALL) {
    return state - 1;
  }

  return state;
}
