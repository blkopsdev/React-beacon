import * as React from 'react';

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
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import { map, values } from 'lodash';
const uuidv4 = require('uuid/v4');

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
        console.error(error);
      });
  };
}

export function getProducts(
  page: number,
  search: string,
  mainCategoryID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());

    const pagingMode = 'paged';
    return axios
      .get(API.GET.inventory.products, {
        params: { page, search, mainCategoryID, pagingMode }
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_PRODUCTS_SUCCESS,
            products: data.data.result
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_PRODUCTS_FAILED });
        constants.handleError(error, 'get products');
        console.error(error);
      });
  };
}

export function getInventory(): ThunkResult<void> {
  return (dispatch, getState) => {
    getInventoryHelper(dispatch, getState);
  };
}
const getInventoryHelper = (dispatch: any, getState: any) => {
  dispatch(beginAjaxCall());
  const {
    page,
    search,
    facility,
    brand,
    mainCategory
  } = getState().manageInventory.tableFilters;
  const facilityID = facility
    ? facility.value
    : getState().user.facilities[0].id;
  const brandID = brand ? brand.value : '';
  const mainCategoryID = mainCategory ? mainCategory.value : '';
  return axios
    .get(API.GET.inventory.getinventory, {
      params: { page, search, facilityID, brandID, mainCategoryID }
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
      console.error(error);
    });
};

export function updateProduct(
  product: Iproduct,
  queueID?: string
): ThunkResult<void> {
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
            product,
            queueID
          });
          // toastr.success('Success', 'Saved product', constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.PRODUCT_UPDATE_FAILED });
        constants.handleError(error, 'update product');
        console.error(error);
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
          // dispatch({ type: types.TOGGLE_MODAL_EDIT_PRODUCT });
          dispatch({ type: types.CLOSE_ALL_MODALS });
          toastr.success(
            'Success',
            'New product created successfully.',
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.PRODUCT_ADD_FAILED });
        constants.handleError(error, 'save product');
        console.error(error);
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
            install
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
        console.error(error);
      });
  };
}

/*
* save (add) an install (an install might have a quantity greater than 1 so we might be adding multiple installs)
* If this is a new product, then also add the product
*/
export function saveInstall(
  install: IinstallBase,
  productID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.CLOSE_ALL_MODALS });
    // if quantity is greater than 1, we are creating multiple installs
    const newID = uuidv4();
    let newInstalls = {};

    if (install.quantity && install.quantity > 1) {
      for (let i = install.quantity - 1; i >= 0; i--) {
        const newIDb = uuidv4();
        newInstalls = {
          ...newInstalls,
          [newIDb]: { ...install, id: newIDb, quantity: 1 }
        };
      }
    } else {
      newInstalls = { [newID]: { ...install, id: newID } };
    }
    return axios
      .post(API.POST.inventory.addinstall, values(newInstalls))
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.INSTALL_ADD_SUCCESS,
            installs: values(newInstalls),
            productID
          });
          toastr.success('Success', 'Saved install', constants.toastrSuccess);
          // get updated inventory
          getInventoryHelper(dispatch, getState);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.INSTALL_ADD_FAILED });
        constants.handleError(error, 'save install');
        console.error(error);
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
        console.error(error);
      });
  };
}

export function installContact(
  installBaseID: string,
  message: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_INSTALL_CONTACT });
    const facility = getState().manageInventory.tableFilters.facility;
    const facilityID = facility
      ? facility.value
      : getState().user.facilities[0].id;
    return axios
      .post(API.POST.inventory.installContact, {
        facilityID,
        installBaseID,
        message
      })
      .then(data => {
        dispatch({
          type: types.INSTALL_CONTACT_SUCCESS
        });
        toastr.success(
          'Contacted Beacon',
          'We will respond within 24 hours.',
          constants.toastrSuccess
        );
      })
      .catch((error: any) => {
        dispatch({ type: types.INSTALL_CONTACT_FAILED });
        constants.handleError(error, 'contact support');
        console.error(error);
      });
  };
}

export function importInstall(file: any): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const facility = getState().manageInventory.tableFilters.facility;
    const facilityID = facility
      ? facility.value
      : getState().user.facilities[0].id;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('facilityID', facilityID);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    return axios
      .post(API.POST.inventory.importInstall, formData, config)
      .then(data => {
        dispatch({
          type: types.IMPORT_INSTALL_SUCCESS
        });
        dispatch({ type: types.TOGGLE_MODAL_IMPORT_INSTALL });
        getInventoryHelper(dispatch, getState);
        const customMessage = (
          <div dangerouslySetInnerHTML={{ __html: data.data }} />
        );
        if (data.status === 200) {
          toastr.success('Imported', '', {
            ...constants.toastrSuccess,
            component: customMessage
          });
        } else {
          // status === 206
          toastr.warning('Import Errors', '', {
            ...constants.toastrSuccess,
            component: customMessage,
            timeOut: 0
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.IMPORT_INSTALL_FAILED });
        // constants.handleError(error, 'importing');
        toastr.error(
          'Error',
          'Please check your email for details on the failed import.',
          constants.toastrError
        );
        console.error(error);
      });
  };
}

export const requestQuote = ({
  message,
  facilityID
}: {
  message: string;
  facilityID: string;
}): ThunkResult<void> => {
  return (dispatch, getState) => {
    const QuoteItems = map(
      getState().manageInventory.cart.productsByID,
      (product, key) => {
        return { productID: key, quantity: product.quantity };
      }
    );
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_SHOPPING_CART_INVENTORY });
    return axios
      .post(API.POST.inventory.quote, { QuoteItems, facilityID, message })
      .then(data => {
        dispatch({
          type: types.CHECKOUT_INVENTORY_SUCCESS
        });
        toastr.success('Success', 'requested quote', constants.toastrSuccess);
      })
      .catch((error: any) => {
        dispatch({ type: types.CHECKOUT_INVENTORY_FAILED });
        constants.handleError(error, 'requesting quote');
        console.error(error);
      });
  };
};

export function mergeProduct(
  sourceProductID: string,
  targetProductID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.CLOSE_ALL_MODALS });
    return axios
      .post(
        `${
          API.POST.inventory.mergeProduct
        }?sourceProductID=${sourceProductID}&targetProductID=${targetProductID}`
      )
      .then(data => {
        dispatch({
          type: types.PRODUCT_MERGE_SUCCESS
        });
        toastr.success('Success', 'merged product', constants.toastrSuccess);
      })
      .catch((error: any) => {
        dispatch({ type: types.PRODUCT_MERGE_FAILED });
        constants.handleError(error, 'merge product');
        console.error(error);
      });
  };
}

export const toggleEditProductModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_PRODUCT
});

export const toggleEditInstallModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_INSTALL
});

export const toggleInstallContactModal = () => ({
  type: types.TOGGLE_MODAL_INSTALL_CONTACT
});
export const toggleSearchNewProductsModal = () => ({
  type: types.TOGGLE_MODAL_SEARCH_NEW_PRODUCTS
});
export const toggleImportInstallModal = () => ({
  type: types.TOGGLE_MODAL_IMPORT_INSTALL
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_INVENTORY,
  filters
});

export const setSelectedProduct = (product?: Iproduct) => ({
  type: types.SET_SELECTED_PRODUCT,
  product
});
export const resetNewProducts = () => ({
  type: types.NEW_PRODUCTS_RESET
});
