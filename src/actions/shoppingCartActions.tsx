// import shop from '../api/shop';
import API from '../constants/apiEndpoints';
import axios from 'axios';
import { beginAjaxCall } from './ajaxStatusActions';

import * as types from './actionTypes';
import { ThunkResult, Iproduct } from '../models';
// import { toastr } from "react-redux-toastr";
import constants from '../constants/constants';
import { map } from 'lodash';

export const addToCart = (product: Iproduct) => ({
  type: types.ADD_TO_CART,
  product
});
export const decreaseFromCart = (productID: string) => ({
  type: types.DECREASE_FROM_CART,
  productID
});
export const updateQuantityCart = (quantity: number, productID: string) => ({
  type: types.UPDATE_QUANTITY_CART,
  productID,
  quantity
});
export const deleteFromCart = (productID: string) => ({
  type: types.DELETE_FROM_CART,
  productID
});

export const checkout = ({
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
    dispatch({ type: types.TOGGLE_MODAL_SHOPPING_CART });
    return axios
      .post(API.POST.inventory.quote, { QuoteItems, facilityID, message })
      .then(data => {
        dispatch({
          type: types.CHECKOUT_SUCCESS
        });
        // toastr.success("Success", "requested quote", constants.toastrSuccess);
      })
      .catch((error: any) => {
        dispatch({ type: types.CHECKOUT_FAILED });
        constants.handleError(error, 'requesting quote');
        throw error;
      });
  };
};
export const toggleShoppingCartModal = () => ({
  type: types.TOGGLE_MODAL_SHOPPING_CART
});
