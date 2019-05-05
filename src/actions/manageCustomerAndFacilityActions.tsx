import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';
import { toastr } from 'react-redux-toastr';
import { ItableFiltersParams } from '../models';
import { FormUtil } from '../components/common/FormUtil';

export function getCustomers() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const { page, name } = getState().customerAndFacilityManage.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, name }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.customer.getall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_CUSTOMERS_AND_FACILITY_SUCCESS,
            payload: data.data
          });
          dispatch({
            type: types.CUSTOMERS_AND_FACILITY_TOTAL_PAGES,
            pages: data.data.pages
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_CUSTOMERS_AND_FACILITY_FAILED });
        constants.handleError(error, 'get brands');
        console.error(error);
      });
  };
}

export function saveBrand(brand: any) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { name: brand }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.brand.add;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          const newBrand = { name: brand, id: data.data };
          dispatch({
            type: types.ADD_BRAND_SUCCESS,
            payload: newBrand
          });
          const inventoryProductInfo = getState().manageInventory.productInfo;
          // Check if brands are loaded in inventory
          if (
            inventoryProductInfo.brandOptions &&
            !!inventoryProductInfo.brandOptions.length
          ) {
            const brands = {
              [newBrand.id]: newBrand,
              ...inventoryProductInfo.brands
            };
            const brandOptions = [
              FormUtil.convertToSingleOption(newBrand),
              ...inventoryProductInfo.brandOptions
            ];
            // Add new brand in inventory brand list
            dispatch({
              type: types.UPDATE_PRODUCT_INFO_SUCCESS,
              payload: { brands, brandOptions }
            });
          }
          // dispatch({ type: types.TOGGLE_MODAL_EDIT_BRAND });
          toastr.success('Success', `Created Brand.`, constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.ADD_BRAND_FAILED });
        constants.handleError(error, 'get brands');
        console.error(error);
      });
  };
}

export function updateBrand(brand: any) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'put',
      data: { ...brand }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = `${API.PUT.brand.update}/${brand.id}`;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.EDIT_BRAND_SUCCESS,
            payload: brand
          });
          const inventoryProductInfo = getState().manageInventory.productInfo;
          // Check if brands are loaded in inventory
          if (
            inventoryProductInfo.brandOptions &&
            !!inventoryProductInfo.brandOptions.length
          ) {
            const brands = {
              ...inventoryProductInfo.brands,
              [brand.id]: brand
            };
            const brandOptions = inventoryProductInfo.brandOptions.map(
              (b: any) => {
                if (b.value === brand.id) {
                  return { ...b, label: brand.name };
                }
                return b;
              }
            );
            // Update brand in inventory brand list
            dispatch({
              type: types.UPDATE_PRODUCT_INFO_SUCCESS,
              payload: { brands, brandOptions }
            });
          }
          // dispatch({ type: types.TOGGLE_MODAL_EDIT_BRAND });
          toastr.success('Success', `Updated Brand.`, constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.EDIT_BRAND_FAILED });
        constants.handleError(error, 'get brands');
        console.error(error);
      });
  };
}

export const setSelectedCustomerAndFacilityID = (id: string) => ({
  type: types.SET_SELECTED_CUSTOMER_AND_FACILITY_ID,
  id
});

export const clearSelectedCustomerAndFacilityID = () => ({
  type: types.CLEAR_SELECTED_CUSTOMER_AND_FACILITY_ID
});

export const toggleEditCustomerAndFacilityModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_CUSTOMER_AND_FACILITY
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_CUSTOMER_AND_FACILITY,
  filters
});
