import * as types from '../actions/actionTypes';
import { IuserQueueModals } from '../models';
import initialState from './initialState';

export default function userQueueModals(
  state: IuserQueueModals = initialState.userQueueModals,
  action: any
): IuserQueueModals {
  switch (action.type) {
    case types.TOGGLE_EDIT_USER_MODAL:
      return { ...state, showEditUserModal: !state.showEditUserModal };
    default:
      return state;
  }
}
