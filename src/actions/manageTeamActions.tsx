import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import { IinitialState, ItableFiltersParams, Iuser } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';

// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getUserManage(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageTeam.tableFilters;
    return axios
      .get(API.GET.user.getteamsearch, { params: { page, search } })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.TEAM_MANAGE_SUCCESS, team: data.data[1] });
          dispatch({
            type: types.TEAM_MANAGE_TOTAL_PAGES,
            pages: data.data[0]
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.TEAM_MANAGE_FAILED });
        constants.handleError(error, 'get team members');
        console.error(error);
      });
  };
}

export function updateTeamUser(user: Iuser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_TEAM });
    return axios
      .post(API.POST.user.updateteam, user)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.TEAM_UPDATE_SUCCESS,
            user: data.data
          });

          // toastr.success('Success', 'Saved user', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.TEAM_UPDATE_FAILED });
        constants.handleError(error, 'update user');
        console.error(error);
      });
  };
}

/*
* save (add) a new team member
*/
export function saveTeamUser(user: Iuser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.user.saveteam, user)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.TEAM_SAVE_SUCCESS,
            user: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_TEAM });
          toastr.success(
            'Success',
            'Team member has been submitted for approval.',
            constants.toastrSuccess
          );
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.TEAM_SAVE_FAILED });
        constants.handleError(error, 'save user');
        console.error(error);
      });
  };
}

/*
* delete a team member
*/
export function deleteTeamUser(memberID: string): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_TEAM });
    return axios
      .post(API.POST.user.deleteTeamMember, { ID: memberID })
      .then(data => {
        dispatch({
          type: types.TEAM_DELETE_SUCCESS,
          memberID
        });

        // toastr.success('Success', 'Deleted user', constants.toastrSuccess);
      })
      .catch((error: any) => {
        dispatch({ type: types.TEAM_DELETE_FAILED });
        constants.handleError(error, 'delete user');
        console.error(error);
      });
  };
}

export const toggleEditTeamUserModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_TEAM
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_TEAM,
  filters
});
