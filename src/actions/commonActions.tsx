import { Ioption } from '../models';
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
export const setTableFilter = (filters: {
  search?: string;
  page?: number;
  facility?: Ioption;
  customer?: Ioption;
  productGroup?: Ioption;
  manufacturer?: Ioption;
}) => ({
  type: types.SET_TABLE_FILTER_MANAGE_INVENTORY,
  filters
});
