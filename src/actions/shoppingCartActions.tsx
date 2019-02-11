import { IshoppingCartProduct } from '../models';
// import { toastr } from "react-redux-toastr";

export const addToCart = (product: IshoppingCartProduct, cartName: string) => ({
  type: `ADD_TO_CART_${cartName}`,
  product
});
export const decreaseFromCart = (productID: string, cartName: string) => ({
  type: `DECREASE_FROM_CART_${cartName}`,
  productID
});
export const updateQuantityCart = (
  quantity: number,
  productID: string,
  cartName: string
) => ({
  type: `UPDATE_QUANTITY_CART_${cartName}`,
  productID,
  quantity
});
export const deleteFromCart = (productID: string, cartName: string) => ({
  type: `DELETE_FROM_CART_${cartName}`,
  productID
});

export const toggleShoppingCartModal = (cartName: string) => ({
  type: `TOGGLE_MODAL_SHOPPING_CART_${cartName}`
});
