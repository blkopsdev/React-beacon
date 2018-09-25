import * as types from './actionTypes';

export const closeAllModals = () => ({
  type: types.CLOSE_ALL_MODALS
});
export const toggleEditCustomerModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_CUSTOMER
});
export const toggleEditFacilityModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_FACILITY
});
