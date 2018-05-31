import * as types from './actionTypes';

export function beginAjaxCall() {
  return {type: types.BEGIN_AJAX_CALL};
}

export function endAjaxCall() {
  return {type: types.END_AJAX_CALL};
}

export function manualAjaxStart() {
  return (dispatch: any) => {
    dispatch(beginAjaxCall());
  };
}

export function manualAjaxEnd() {
  return (dispatch: any) => {
    dispatch(endAjaxCall());
  };
}
