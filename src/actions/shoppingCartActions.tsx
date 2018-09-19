// import shop from '../api/shop';
import API from '../constants/apiEndpoints';
import axios from 'axios';
import { beginAjaxCall } from './ajaxStatusActions';

import * as types from './actionTypes';
import { Iproduct, ThunkResult } from '../models';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';

export const addToCart = (productID: string) => ({
  type: types.ADD_TO_CART,
  productID
});
export const decreaseFromCart = (productID: string) => ({
  type: types.DECREASE_FROM_CART,
  productID
});
export const deleteFromCart = (productID: string) => ({
  type: types.DELETE_FROM_CART,
  productID
});

export const checkout = (
  QuoteItems: Iproduct[],
  facilityID: string,
  message: string
): ThunkResult<void> => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.inventory.quote, { QuoteItems, facilityID, message })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.CHECKOUT_SUCCESS,
            product: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_QUOTE });
          toastr.success('Success', 'Saved product', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.CHECKOUT_FAILED });
        constants.handleError(error, 'save product');
        throw error;
      });
  };
};
