import * as types from '../actions/actionTypes';
import initialState from './initialState';
import { IshoppingCart, Iproduct } from '../models';
import { filter, omit } from 'lodash';

const addedIds = (
  state: string[] = initialState.manageInventory.cart.addedIDs,
  action: any
) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      if (state.indexOf(action.product.id) !== -1) {
        return state;
      }
      return [...state, action.product.id];
    case types.DELETE_FROM_CART:
      if (state.indexOf(action.productID) === -1) {
        return state;
      }
      return filter(state, item => item !== action.productID);
    default:
      return state;
  }
};

const productsByID = (
  state: { [key: string]: Iproduct } = initialState.manageInventory.cart
    .productsByID,
  action: any
) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      const { product } = action;
      return {
        ...state,
        [product.id]: {
          ...product,
          quantity: (state[product.id] ? state[product.id].quantity : 0) + 1
        }
      };
    case types.DECREASE_FROM_CART:
      return {
        ...state,
        [action.productID]: {
          ...state[action.productID],
          quantity:
            (state[action.productID] ? state[action.productID].quantity : 1) - 1
        }
      };
    case types.UPDATE_QUANTITY_CART:
      return {
        ...state,
        [action.productID]: {
          ...state[action.productID],
          quantity: state[action.productID] ? action.quantity : 1
        }
      };
    case types.DELETE_FROM_CART:
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

const cart = (
  state: IshoppingCart = initialState.manageInventory.cart,
  action: any
): IshoppingCart => {
  switch (action.type) {
    case types.CHECKOUT_SUCCESS:
      return initialState.manageInventory.cart;
    case types.CHECKOUT_FAILED:
      return state;
    default:
      return {
        addedIDs: addedIds(state.addedIDs, action),
        productsByID: productsByID(state.productsByID, action)
      };
  }
};

export default cart;
