import { ThunkAction } from 'redux-thunk';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { IinitialState, Iproduct, ItableFiltersParams } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from '../constants/constants';
import * as types from './actionTypes';
import { msalFetch } from '../components/auth/Auth-Utils';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getProductQueue(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageProductQueue.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, search }
    };

    const url = API.GET.inventory.getproductqueue;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.PRODUCT_QUEUE_SUCCESS,
            products: data.data[1]
          });
          dispatch({
            type: types.PRODUCT_QUEUE_TOTAL_PAGES,
            pages: data.data[0]
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.PRODUCT_QUEUE_FAILED });
        constants.handleError(error, 'get product queue');
        console.error(error);
      });
  };
}

export function approveProduct(productQueueID: string, dispatch: any) {
  const axiosOptions: AxiosRequestConfig = {
    method: 'post',
    data: { id: productQueueID }
  };

  const url = API.POST.inventory.approveproduct;
  return msalFetch(url, axiosOptions)
    .then((data: AxiosResponse<any>) => {
      if (!data.data) {
        throw undefined;
      } else {
        dispatch({
          type: types.PRODUCT_APPROVE_SUCCESS,
          productQueueID
        });
      }
    })
    .catch((error: any) => {
      dispatch({ type: types.PRODUCT_APPROVE_FAILED });
      constants.handleError(error, 'approve product');
      console.error(error);
    });
}

export function updateQueueProduct(
  product: Iproduct,
  shouldApprove?: boolean,
  queueID?: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_PRODUCT });
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: product
    };

    const url = API.POST.inventory.updateproduct;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.PRODUCT_UPDATE_SUCCESS,
            product: data.data,
            queueID
          });
          // toastr.success('Success', 'Saved product', constants.toastrSuccess);
          if (shouldApprove && queueID) {
            dispatch(beginAjaxCall());
            approveProduct(queueID, dispatch); // don't return this because if we do, we will see two errors
          }
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.PRODUCT_UPDATE_FAILED });
        constants.handleError(error, 'update product');
        console.error(error);
      });
  };
}

export const toggleApproveProductModal = () => ({
  type: types.TOGGLE_MODAL_APPROVE_PRODUCT
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_PRODUCT_QUEUE,
  filters
});
