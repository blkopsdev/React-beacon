import { pickBy, map, filter } from 'lodash';

import { Iuser, ImanageUserReducer } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';

function userManageData(state: Iuser[] = [], action: any): Iuser[] {
  switch (action.type) {
    case types.USER_MANAGE_SUCCESS:
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
    case types.USER_UPDATE_SUCCESS:
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

function userManageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.USER_MANAGE_TOTAL_PAGES:
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

export default function userManage(
  state: ImanageUserReducer = initialState.manageUser,
  action: any
) {
  return {
    data: userManageData(state.data, action),
    totalPages: userManageTotalPages(state.totalPages, action),
    showEditUserModal: modalToggleWithName(
      state.showEditUserModal,
      action,
      'EDIT_USER'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_USER'
    )
  };
}
