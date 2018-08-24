import * as types from '../actions/actionTypes';

export default function createShowModalWithNamedType(modalName = '') {
  return function modalToggle(state: boolean = false, action: any) {
    switch (action.type) {
      case `TOGGLE_MODAL_${modalName}`:
        return !state;
      case types.CLOSE_ALL_MODALS:
        return false;
      default:
        return state;
    }
  };
}
