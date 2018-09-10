import * as types from '../actions/actionTypes';
import { Iuser, IuserManage } from '../models';
import initialState from './initialState';
import { pickBy, map, filter } from 'lodash';

function teamManageData(state: Iuser[] = [], action: any): Iuser[] {
  switch (action.type) {
    case types.TEAM_MANAGE_SUCCESS:
      // return action.users;
      return map(action.users, user => {
        const securityFunctions = map(user.securityFunctions, securityF => {
          return securityF.toUpperCase();
        });
        return {
          ...initialState.user,
          ...pickBy(user, (property, key) => property !== null),
          securityFunctions
        };
      });
    case types.TEAM_UPDATE_SUCCESS:
      const filteredUsers = filter(state, u => u.id !== action.user.id);
      const securityFunc = map(action.user.securityFunctions, securityF => {
        return securityF.toUpperCase();
      });
      const updatedUser = {
        ...pickBy(action.user, (property, key) => property !== null),
        securityFunctions: securityFunc
      };

      return [...filteredUsers, updatedUser] as Iuser[];

    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function userManagePage(state: number = 1, action: any): number {
  switch (action.type) {
    case types.TEAM_MANAGE_INCREMENT:
      return state + 1;
    case types.TEAM_MANAGE_DECREMENT:
      if (state > 1) {
        return state - 1;
      }
    default:
      return state;
  }
}
function userManageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.TEAM_MANAGE_TOTAL_PAGES:
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
    data: teamManageData(state.data, action),
    page: userManagePage(state.page, action),
    totalPages: userManageTotalPages(state.totalPages, action)
  };
}
