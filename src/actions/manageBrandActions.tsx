import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';
import { toastr } from 'react-redux-toastr';
import { ItableFiltersParams } from '../models';

export function getBrands() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageBrand.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, search }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.brand.getall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.LOAD_BRANDS_SUCCESS, payload: data.data });
          dispatch({
            type: types.BRAND_MANAGE_TOTAL_PAGES,
            pages: data.data.pages
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.LOAD_BRANDS_SUCCESS });
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
          dispatch({
            type: types.ADD_BRAND_SUCCESS,
            payload: { name: brand, id: data.data }
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_BRAND });
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
          dispatch({ type: types.TOGGLE_MODAL_EDIT_BRAND });
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

export function deleteBrand(brand: any) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'delete'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = `${API.DELETE.brand.remove}/${brand.id}`;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.REMOVE_BRAND_SUCCESS,
            payload: brand
          });
          // dispatch({type: types.TOGGLE_MODAL_EDIT_BRAND});
          toastr.success('Success', `Deleted Brand.`, constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.REMOVE_BRAND_FAILED });
        constants.handleError(error, 'get brands');
        console.error(error);
      });
  };
}

export const toggleEditBrandModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_BRAND
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_BRAND,
  filters
});
