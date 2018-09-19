import {
  ADD_TO_CART,
  CHECKOUT_REQUEST,
  CHECKOUT_FAILED
} from '../actions/actionTypes';
import initialState from './initialState';
import { IshoppingCart, Iquantity } from '../models';

const addedIds = (
  state: string[] = initialState.manageInventory.cart.addedIDs,
  action: any
) => {
  switch (action.type) {
    case ADD_TO_CART:
      if (state.indexOf(action.productID) !== -1) {
        return state;
      }
      return [...state, action.productID];
    default:
      return state;
  }
};

const quantityById = (
  state: Iquantity = initialState.manageInventory.cart.quantityByID,
  action: any
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { productID } = action;
      return {
        ...state,
        [productID]: (state[productID] || 0) + 1
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
    case CHECKOUT_REQUEST:
      return initialState;
    case CHECKOUT_FAILED:
      return action.cart;
    default:
      return {
        addedIDs: addedIds(state.addedIDs, action),
        quantityByID: quantityById(state.quantityByID, action)
      };
  }
};

export default cart;
