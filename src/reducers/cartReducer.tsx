import * as types from '../actions/actionTypes';
import initialState from './initialState';
import { IshoppingCart, Iquantity } from '../models';
import { filter } from 'lodash';

const addedIds = (
  state: string[] = initialState.manageInventory.cart.addedIDs,
  action: any
) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      if (state.indexOf(action.productID) !== -1) {
        return state;
      }
      return [...state, action.productID];
    case types.DELETE_FROM_CART:
      if (state.indexOf(action.productID) !== -1) {
        return state;
      }
      return filter(state, action.productID);
    default:
      return state;
  }
};

const quantityById = (
  state: Iquantity = initialState.manageInventory.cart.quantityByID,
  action: any
) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      const { productID } = action;
      return {
        ...state,
        [productID]: (state[productID] || 0) + 1
      };
    case types.DECREASE_FROM_CART:
      return {
        ...state,
        [action.productID]: (state[action.productID] || 1) - 1
      };
    default:
      return state;
  }
};

export const getQuantity = (state: IshoppingCart, productID: string): number =>
  state.quantityByID[productID] || 0;

export const getAddedIDs = (state: IshoppingCart) => state.addedIDs;

const cart = (
  state: IshoppingCart = initialState.manageInventory.cart,
  action: any
): IshoppingCart => {
  switch (action.type) {
    case types.CHECKOUT_REQUEST:
      return initialState;
    case types.CHECKOUT_FAILED:
      return action.cart;
    default:
      return {
        addedIDs: addedIds(state.addedIDs, action),
        quantityByID: quantityById(state.quantityByID, action)
      };
  }
};

export default cart;
