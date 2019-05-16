import * as React from 'react';

import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import {
  IinitialState,
  IinstallBase,
  Iproduct,
  ItableFiltersParams,
  ImeasurementPointResult,
  Ioption
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import { map, values } from 'lodash';
const uuidv4 = require('uuid/v4');
import * as moment from 'moment';
import { getFacilityMeasurementPointResultsHelper } from './measurementPointResultsActions';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';

// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getProductInfo(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.inventory.getproductinfo;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
  mainCategoryID: string,
  isApproved?: boolean
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const pagingType = 'paged';
    let params: {
      page: number;
      search: string;
      mainCategoryID: string;
      pagingType: string;
      isApproved?: boolean;
    } = { page, search, mainCategoryID, pagingType };
    if (isApproved !== undefined) {
      params = { ...params, isApproved };
    }
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.inventory.products;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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

/*
* get measurement point results then get inventory and add the result status to the installBases
*/
export function initInventory(facilityID: string): ThunkResult<void> {
  return (dispatch, getState) => {
    getFacilityMeasurementPointResultsHelper(dispatch, getState, facilityID)
      .then(() => getInventoryHelper(dispatch, getState))
      .catch((error: any) =>
        console.error('error getting measurement point results', error)
      );
  };
}

const getInventoryHelper = (dispatch: any, getState: () => IinitialState) => {
  dispatch(beginAjaxCall());
  const { measurementPointResultsByID } = getState().measurementPointResults;
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

  const axiosOptions: AxiosRequestConfig = {
    method: 'get',
    params: { page, search, facilityID, brandID, mainCategoryID }
  };
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  const url = API.GET.inventory.getinventory;
  return adalFetch(authContext, resource, axios, url, axiosOptions)
    .then((data: AxiosResponse<any>) => {
      if (!data.data) {
        throw undefined;
      } else {
        const rawInventory = data.data[1];
        const inventoryWithStatus = rawInventory.map((product: Iproduct) => {
          if (measurementPointResultsByID) {
            const updatedInstallBases = updateInstallBaseStatus(
              product.installs,
              values(measurementPointResultsByID)
            );
            return { ...product, installs: updatedInstallBases };
          } else {
            // no results for this job, so just set everything to status 0
            const updatedInstallBases = product.installs.map(installBase => {
              return {
                ...installBase,
                status: constants.measurementPointResultStatusTypes[0]
              };
            });
            return { ...product, installs: updatedInstallBases };
          }
        });

        dispatch({
          type: types.GET_INVENTORY_SUCCESS,
          inventory: inventoryWithStatus
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: product
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.updateproduct;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: product
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.addproduct;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: install
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.updateinstall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: values(newInstalls)
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.addinstall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { id: installID }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.deleteInstall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: {
        facilityID,
        installBaseID,
        message
      }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.installContact;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch({
          type: types.INSTALL_CONTACT_SUCCESS
        });
        toastr.success(
          'Contacted Beacon',
          'We will respond within 24 hours.',
          constants.toastrSuccess
        );
      })
      .catch((error: AxiosError) => {
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
    formData.append('name', 'file');
    // formData.append('filename', 'testfilename.xlsx');
    formData.append('facilityID', facilityID);

    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: formData,
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.importInstall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { QuoteItems, facilityID, message }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.quote;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { sourceProductID, targetProductID }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.inventory.mergeProduct;
    return adalFetch(authContext, resource, axios, url, axiosOptions).then(
      (data: AxiosResponse<any>) => {
        dispatch({
          type: types.PRODUCT_MERGE_SUCCESS
        });
        toastr.success('Success', 'merged product', constants.toastrSuccess);
      },
      (error: any) => {
        dispatch({ type: types.PRODUCT_MERGE_FAILED });
        constants.handleError(error, 'merge product');
        Promise.reject(error);
      }
    );
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
export const toggleMPResultModal = () => ({
  type: types.TOGGLE_MODAL_MP_RESULT
});
export const toggleMPResultHistory = () => ({
  type: types.TOGGLE_MODAL_MP_RESULT_HISTORY
});
export const toggleMPResultAddModal = () => ({
  type: types.TOGGLE_MODAL_MP_RESULT_ADD
});
export const toggleMPResultNotes = () => ({
  type: types.TOGGLE_MODAL_MP_RESULT_NOTES
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

export const updateInstallBaseStatus = (
  installBases: IinstallBase[],
  MPResults: ImeasurementPointResult[]
  // products?: { [key: string]: Iproduct }
) => {
  return installBases.map(installBase => {
    const installResults = MPResults.filter(result => {
      return result.installBaseID === installBase.id;
    });
    if (installResults && installResults.length) {
      const mostRecentResult = installResults.reduce((previous, current) => {
        if (
          moment
            .utc(previous.updateDate)
            .isAfter(moment.utc(current.updateDate))
        ) {
          return previous;
        } else {
          return current;
        }
      });
      return {
        ...installBase,
        status:
          constants.measurementPointResultStatusTypes[mostRecentResult.status]
        // product: products ? products[installBase.productID] : initialProduct
      };
    } else {
      return {
        ...installBase,
        status: constants.measurementPointResultStatusTypes[0]
        // product: products ? products[installBase.productID] : initialProduct
      };
    }
  });
};

/*
  * product names are generated by: brand, category, subcategory, type, power, model, standard
  */
export const createProductName = (
  brandID: Ioption,
  mainCategoryID: Ioption,
  subcategoryID: Ioption,
  productTypeID: Ioption,
  powerID: Ioption,
  systemSizeID: Ioption,
  standardID: Ioption
) => {
  const brand = brandID && brandID.label !== 'N/A' ? brandID.label : '';
  const category =
    mainCategoryID && mainCategoryID.label !== 'N/A'
      ? `: ${mainCategoryID.label}`
      : '';
  const subcategory =
    subcategoryID && subcategoryID.label !== 'N/A'
      ? `: ${subcategoryID.label}`
      : '';
  const productType =
    productTypeID && productTypeID.label !== 'N/A'
      ? `: ${productTypeID.label}`
      : '';
  const power = powerID && powerID.label !== 'N/A' ? `: ${powerID.label}` : '';
  const systemSize =
    systemSizeID && systemSizeID.label !== 'N/A'
      ? `: ${systemSizeID.label}`
      : '';
  const standard =
    standardID && standardID.label !== 'N/A' ? `: ${standardID.label}` : '';
  return `${brand}${category}${subcategory}${productType}${power}${systemSize}${standard}`;
};
