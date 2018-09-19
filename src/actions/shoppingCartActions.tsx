import shop from '../api/shop';
import * as types from '../constants/ActionTypes';
import { Iproduct, ThunkResult } from '../models';

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

export const addToCart = (productID: string): ThunkResult<void> => (
  dispatch,
  getState
) => ({
  type: types.ADD_TO_CART,
  productID
});

export const checkout = (products: Iproduct[]): ThunkResult<void> => (
  dispatch,
  getState
) => {
  const { cart } = getState().manageInventory;

  dispatch({
    type: types.CHECKOUT_REQUEST
  });
  shop.buyProducts(products, () => {
    dispatch({
      type: types.CHECKOUT_SUCCESS,
      cart
    });
    // Replace the line above with line below to rollback on failure:
    // dispatch({ type: types.CHECKOUT_FAILURE, cart })
  });
};
