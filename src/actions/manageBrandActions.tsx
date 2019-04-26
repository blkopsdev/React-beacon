import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';

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
          dispatch({ type: types.LOAD_BRANDS_SUCCESS, payload: data.data });
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
