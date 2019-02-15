import { ThunkAction } from 'redux-thunk';
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
    const { page, search } = getState().manageProductQueue.tableFilters;
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
        console.error(error);
      });
  };
}

export function approveProduct(productQueueID: string, dispatch: any) {
  return axios
    .post(API.POST.inventory.approveproduct, { id: productQueueID })
    .then(data => {
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
    return axios
      .post(API.POST.inventory.updateproduct, product)
      .then(data => {
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
