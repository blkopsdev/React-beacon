import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import {
  IinitialState,
  IinstallBase,
  Iproduct,
  ItableFiltersParams
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';

// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getProductInfo(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .get(API.GET.inventory.getproductinfo)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_PRODUCT_INFO_SUCCESS,
            data: data.data
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_PRODUCT_INFO_FAILED });
        constants.handleError(error, 'get product info');
        throw error;
      });
  };
}

export function getInventory(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const {
      page,
      search,
      facility,
      manufacturer,
      productGroup
    } = getState().manageInventory.tableFilters;
    const facilityID = facility
      ? facility.value
      : getState().user.facilities[0].id;
    const manufacturerID = manufacturer ? manufacturer.value : '';
    const productGroupID = productGroup ? productGroup.value : '';
    return axios
      .get(API.GET.inventory.getinventory, {
        params: { page, search, facilityID, manufacturerID, productGroupID }
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_INVENTORY_SUCCESS,
            inventory: data.data[1]
          });
          dispatch({
            type: types.INVENTORY_TOTAL_PAGES,
            pages: data.data[0]
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_INVENTORY_FAILED });
        constants.handleError(error, 'get inventory');
        throw error;
      });
  };
}

export function updateProduct(product: Iproduct): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_PRODUCT });
    return axios
      .post(API.POST.inventory.updateproduct, product)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.PRODUCT_UPDATE_SUCCESS,
            product: data.data
          });
          // toastr.success('Success', 'Saved product', constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.PRODUCT_UPDATE_FAILED });
        constants.handleError(error, 'update product');
        throw error;
      });
  };
}

/*
* save (add) a new product
*/
export function saveProduct(product: Iproduct): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_PRODUCT });
    return axios
      .post(API.POST.inventory.addproduct, product)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.PRODUCT_ADD_SUCCESS,
            product: data.data
          });
          toastr.success(
            'Success',
            'Submitted new product for approval.',
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.PRODUCT_ADD_FAILED });
        constants.handleError(error, 'save product');
        throw error;
      });
  };
}

export function updateInstall(
  install: IinstallBase,
  productID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_INSTALL });
    return axios
      .post(API.POST.inventory.updateinstall, install)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.INSTALL_UPDATE_SUCCESS,
            install: data.data
          });

          // toastr.success(
          //   'Success',
          //   'Saved installation',
          //   constants.toastrSuccess
          // );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.INSTALL_UPDATE_FAILED });
        constants.handleError(error, 'update installation');
        throw error;
      });
  };
}

/*
* save (add) an install (an install might have a quantity greater than 1 so we might be adding multiple installs)
*/
export function saveInstall(
  install: IinstallBase,
  productID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_INSTALL });
    return axios
      .post(API.POST.inventory.addinstall, install)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.INSTALL_ADD_SUCCESS,
            installs: data.data,
            productID
          });
          // toastr.success('Success', 'Saved install', constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.INSTALL_ADD_FAILED });
        constants.handleError(error, 'save install');
        throw error;
      });
  };
}
export function deleteInstall(
  installID: string,
  productID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_INSTALL });
    return axios
      .post(API.POST.inventory.deleteInstall, { id: installID })
      .then(data => {
        dispatch({
          type: types.INSTALL_DELETE_SUCCESS,
          installID,
          productID
        });
        // toastr.success('Success', 'Install deleted', constants.toastrSuccess);
      })
      .catch((error: any) => {
        dispatch({ type: types.INSTALL_DELETE_FAILED });
        constants.handleError(error, 'delete install');
        throw error;
      });
  };
}

export const toggleEditProductModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_PRODUCT
});

export const toggleEditInstallModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_INSTALL
});

export const toggleEditQuoteModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_QUOTE
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_INVENTORY,
  filters
});
