import * as types from '../actions/actionTypes';
import { Iproduct, ImanageInventory } from '../models';
import initialState from './initialState';
import { pickBy, map, filter } from 'lodash';

function dataReducer(state: Iproduct[] = [], action: any): Iproduct[] {
  switch (action.type) {
    case types.GET_INVENTORY_SUCCESS:
      return action.inventory;
    // return map(action.data, d => {
    //   return {
    //     ...pickBy(d, (property, key) => property !== null)
    //   };
    // });
    case types.INVENTORY_UPDATE_SUCCESS:
      const filteredUsers = filter(state, u => u.id !== action.user.id);
      const securityFunc = map(action.user.securityFunctions, securityF => {
        return securityF.toUpperCase();
      });
      const updatedUser = {
        ...pickBy(action.user, (property, key) => property !== null),
        securityFunctions: securityFunc
      };

      return [...filteredUsers, updatedUser] as Iproduct[];
    case types.INVENTORY_SAVE_SUCCESS:
      const securityFunct = map(action.user.securityFunctions, securityF => {
        return securityF.toUpperCase();
      });
      const updatedTeamMember = {
        ...pickBy(action.user, (property, key) => property !== null),
        securityFunctions: securityFunct
      };

      return [...state, updatedTeamMember] as Iproduct[];

    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function pageReducer(state: number = 1, action: any): number {
  switch (action.type) {
    case types.INVENTORY_INCREMENT:
      return state + 1;
    case types.INVENTORY_DECREMENT:
      if (state > 1) {
        return state - 1;
      }
    default:
      return state;
  }
}
function totalPagesReducer(state: number = 1, action: any): number {
  switch (action.type) {
    case types.INVENTORY_TOTAL_PAGES:
      if (action.pages && action.pages > 0) {
        return action.pages;
      }
      return state;
    default:
      return state;
  }
}

export default function ManageInventory(
  state: ImanageInventory = initialState.manageInventory,
  action: any
) {
  return {
    data: dataReducer(state.data, action),
    page: pageReducer(state.page, action),
    totalPages: totalPagesReducer(state.totalPages, action)
  };
}
