import * as types from '../actions/actionTypes';
import { Iuser, IuserManage } from '../models';
import initialState from './initialState';
import { pickBy, map, filter } from 'lodash';

function userManageData(state: Iuser[] = [], action: any): Iuser[] {
  switch (action.type) {
    case types.USER_MANAGE_SUCCESS:
      // return action.users;
      return map(action.users, user => {
        return {
          ...initialState.user,
          ...pickBy(user, (property, key) => property !== null)
        };
      });
    case types.USER_UPDATE_SUCCESS:
      const filteredUsers = filter(state, u => u.id !== action.user.id);

      return [
        ...filteredUsers,
        pickBy(action.user, (property, key) => property !== null)
      ] as Iuser[];

    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function userManagePage(state: number = 1, action: any): number {
  switch (action.type) {
    case types.USER_MANAGE_INCREMENT:
      return state + 1;
    case types.USER_MANAGE_DECREMENT:
      if (state > 1) {
        return state - 1;
      }
    default:
      return state;
  }
}
function userManageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.USER_MANAGE_TOTAL_PAGES:
      if (action.pages && action.pages > 0) {
        return action.pages;
      }
      return state;
    default:
      return state;
  }
}

export default function userManage(
  state: IuserManage = initialState.userManage,
  action: any
) {
  return {
    data: userManageData(state.data, action),
    page: userManagePage(state.page, action),
    totalPages: userManageTotalPages(state.totalPages, action)
  };
}
