import { pickBy, map } from 'lodash';

import { IproductQueueObject, ImanageProductQueueReducer } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';
import { filter } from 'lodash';

function dataReducer(
  state: IproductQueueObject[] = [],
  action: any
): IproductQueueObject[] {
  switch (action.type) {
    case types.PRODUCT_QUEUE_SUCCESS:
      return map(action.products, d => {
        return {
          ...(pickBy(
            d,
            (property, key) => property !== null
          ) as IproductQueueObject)
        };
      });
    case types.PRODUCT_APPROVE_SUCCESS:
      return filter(state, u => u.id !== action.productQueueID);
    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function totalPagesReducer(state: number = 1, action: any): number {
  switch (action.type) {
    case types.PRODUCT_QUEUE_TOTAL_PAGES:
      if (action.pages && action.pages > 0) {
        return action.pages;
      }
      return state;
    case types.USER_LOGOUT_SUCCESS:
      return 1;
    default:
      return state;
  }
}

export default function ManageProductQueue(
  state: ImanageProductQueueReducer = initialState.manageProductQueue,
  action: any
) {
  return {
    data: dataReducer(state.data, action),
    totalPages: totalPagesReducer(state.totalPages, action),
    showApproveProductModal: modalToggleWithName(
      state.showApproveProductModal,
      action,
      'APPROVE_PRODUCT'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_PRODUCT_QUEUE'
    )
    // quoteRequestItems: quoteRequestReducer(state.quoteRequestItems, action)
  };
}
