import initialState from './initialState';
import { IshoppingCart, IshoppingCartProduct } from '../models';
import { filter, omit } from 'lodash';

const addedIds = (
  state: string[] = initialState.manageInventory.cart.addedIDs,
  action: any,
  cartName: string
) => {
  switch (action.type) {
    case `ADD_TO_CART_${cartName}`:
      if (state.indexOf(action.product.id) !== -1) {
        return state;
      }
      return [...state, action.product.id];
    case `DELETE_FROM_CART_${cartName}`:
      if (state.indexOf(action.productID) === -1) {
        return state;
      }
      return filter(state, item => item !== action.productID);
    default:
      return state;
  }
};

const productsByID = (
  state: { [key: string]: IshoppingCartProduct } = initialState.manageInventory
    .cart.productsByID,
  action: any,
  cartName: string
) => {
  switch (action.type) {
    case `ADD_TO_CART_${cartName}`:
      const { product } = action;
      return {
        ...state,
        [product.id]: {
          ...product,
          quantity: (state[product.id] ? state[product.id].quantity : 0) + 1
        }
      };
    case `DECREASE_FROM_CART_${cartName}`:
      return {
        ...state,
        [action.productID]: {
          ...state[action.productID],
          quantity:
            (state[action.productID] ? state[action.productID].quantity : 1) - 1
        }
      };
    case `UPDATE_QUANTITY_CART_${cartName}`:
      return {
        ...state,
        [action.productID]: {
          ...state[action.productID],
          quantity: state[action.productID] ? action.quantity : 1
        }
      };
    case `DELETE_FROM_CART_${cartName}`:
      // const {[action.productID]: v, ...theRest} = state;
      // return theRest;
      return omit(state, [action.productID]);

    default:
      return state;
  }
};

export const getQuantity = (state: IshoppingCart, productID: string): number =>
  state.productsByID[productID].quantity || 0;

export const getAddedIDs = (state: IshoppingCart) => state.addedIDs;

/*
* main cart reducer
*/
export const cartReducerWithName = (
  state: IshoppingCart = initialState.manageInventory.cart,
  action: any,
  cartName: string
): IshoppingCart => {
  switch (action.type) {
    case `CHECKOUT_${cartName}_SUCCESS`:
      return initialState.manageInventory.cart;
    case `CHECKOUT_${cartName}_FAILED`:
      return state;
    default:
      return {
        addedIDs: addedIds(state.addedIDs, action, cartName),
        productsByID: productsByID(state.productsByID, action, cartName)
      };
  }
};

export const getTotal = (state: IshoppingCart) =>
  state.addedIDs.reduce((total, id) => total + getQuantity(state, id), 0);
