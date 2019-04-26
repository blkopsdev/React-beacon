import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';
import {toastr} from "react-redux-toastr";

export function getBrands() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.brand.getall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.LOAD_BRANDS_SUCCESS, payload: data.data.result });
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
       data: {name: brand}
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
               payload: brand
             });
             dispatch({type: types.TOGGLE_MODAL_EDIT_BRAND});
             toastr.success(
                 'Success',
                 `Created Brand.`,
                 constants.toastrSuccess
             );
           }
         }).catch((error: any) => {
           dispatch({ type: types.ADD_BRAND_FAILED});
           constants.handleError(error, 'get brands');
           console.error(error);
         });
  }
}


export function updateBrand(brand: any) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'put',
      data: {...brand}
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
            toastr.success(
                'Success',
                `Updated Brand.`,
                constants.toastrSuccess
            );
          }
        }).catch((error: any) => {
          dispatch({ type: types.EDIT_BRAND_FAILED });
          constants.handleError(error, 'get brands');
          console.error(error);
        });
  }
}


export const toggleEditBrandModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_BRAND
});