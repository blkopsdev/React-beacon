// import shop from '../api/shop';
import API from '../constants/apiEndpoints';
import axios from 'axios';
import { beginAjaxCall } from './ajaxStatusActions';

import * as types from './actionTypes';
import { Iproduct, ThunkResult } from '../models';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';

// const receiveProducts = products => ({
//   type: types.RECEIVE_PRODUCTS,
//   products
// })

// export const getAllProducts = () => dispatch => {
//   shop.getProducts(products => {
//     dispatch(receiveProducts(products))
//   })
// }

// const addToCartUnsafe = (productID : string) => ({
//   type: types.ADD_TO_CART,
//   productID
// })

export const addToCart = (productID: string) => ({
  type: types.ADD_TO_CART,
  productID
});

// export const checkout = (products: Iproduct[]): ThunkResult<void> => (
//   dispatch,
//   getState
// ) => {
//   const { cart } = getState().manageInventory;

//   dispatch({
//     type: types.CHECKOUT_REQUEST
//   });
//   shop.buyProducts(products, () => {
//     dispatch({
//       type: types.CHECKOUT_SUCCESS,
//       cart
//     });
//     // Replace the line above with line below to rollback on failure:
//     // dispatch({ type: types.CHECKOUT_FAILURE, cart })
//   });

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
