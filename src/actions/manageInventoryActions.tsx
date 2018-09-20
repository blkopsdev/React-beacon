import axios from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';
import { Iproduct, IinitialState, Ioption, IinstallBase } from '../models';
import { ThunkAction } from 'redux-thunk';
// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getProductInfo() {
  return (dispatch: any, getState: any) => {
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

export function getInventory(
  page: number,
  search: string,
  facilityID: string,
  manufacturerID: string,
  productGroupID: string
) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
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
          dispatch({ type: types.TOGGLE_MODAL_EDIT_PRODUCT });
          toastr.success('Success', 'Saved product', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.TEAM_UPDATE_FAILED });
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
          dispatch({ type: types.TOGGLE_MODAL_EDIT_PRODUCT });
          toastr.success(
            'Success',
            'Submitted new product for approval.',
            constants.toastrSuccess
          );
          return data;
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
          dispatch({ type: types.TOGGLE_MODAL_EDIT_INSTALL });
          toastr.success(
            'Success',
            'Saved installation',
            constants.toastrSuccess
          );
          return data;
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
          dispatch({ type: types.TOGGLE_MODAL_EDIT_INSTALL });
          toastr.success('Success', 'Saved install', constants.toastrSuccess);
          return data;
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
    return axios
      .post(API.POST.inventory.deleteInstall, { id: installID })
      .then(data => {
        dispatch({
          type: types.INSTALL_DELETE_SUCCESS,
          installID,
          productID
        });
        dispatch({ type: types.TOGGLE_MODAL_EDIT_INSTALL });
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

export const setSelectedFacility = (facility: Ioption) => ({
  type: types.SET_SELECTED_FACILITY,
  facility
});
