import { ThunkAction } from 'redux-thunk';
// import { toastr } from "react-redux-toastr";
import axios from 'axios';

import { IinitialState, Iproduct, ItableFiltersParams } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';

// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getProductQueue(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageInventory.tableFilters;
    return axios
      .get(API.GET.inventory.getproductqueue, {
        params: { page, search }
      })
      .then(data => {
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
        throw error;
      });
  };
}

export function approveProduct(product: Iproduct): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_APPROVE_PRODUCT });
    return axios
      .post(API.POST.inventory.approveproduct, product)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.PRODUCT_APPROVE_SUCCESS,
            product: data.data
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.PRODUCT_APPROVE_FAILED });
        constants.handleError(error, 'approve product');
        throw error;
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
