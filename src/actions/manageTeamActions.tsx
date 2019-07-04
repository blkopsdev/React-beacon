import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { IinitialState, ItableFiltersParams, Iuser } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import { adalFetch } from 'src/components/auth/Auth-Utils';
import { authContext } from './userActions';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getUserManage(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageTeam.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, search }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.user.getteamsearch;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: user
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.user.updateteam;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: user
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.user.saveteam;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { ID: memberID }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.user.deleteTeamMember;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
