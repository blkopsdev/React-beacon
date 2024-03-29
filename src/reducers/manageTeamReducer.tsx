import { pickBy, map, filter } from 'lodash';

import { ImanageTeamReducer, Iuser } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';

function teamManageData(state: Iuser[] = [], action: any): Iuser[] {
  switch (action.type) {
    case types.TEAM_MANAGE_SUCCESS:
      // return action.users;
      return map(action.team, user => {
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
    case types.TEAM_SAVE_SUCCESS:
      // const securityFunct = map(action.user.securityFunctions, securityF => {
      //   return securityF.toUpperCase();
      // });
      // const updatedTeamMember = {
      //   ...pickBy(action.user, (property, key) => property !== null),
      //   securityFunctions: securityFunct
      // };

      // return [...state, updatedTeamMember] as Iuser[];

      // TODO not adding them for now until after they are approved
      return state;
    case types.TEAM_DELETE_SUCCESS:
      return filter(state, member => member.id !== action.memberID);

    case types.USER_LOGOUT_SUCCESS:
      return [];
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
  state: ImanageTeamReducer = initialState.manageTeam,
  action: any
) {
  return {
    data: teamManageData(state.data, action),
    totalPages: userManageTotalPages(state.totalPages, action),
    showEditTeamModal: modalToggleWithName(
      state.showEditTeamModal,
      action,
      'EDIT_TEAM'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_TEAM'
    )
  };
}
