import axios from 'axios';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { beginAjaxCall } from './ajaxStatusActions';
import { toastr } from 'react-redux-toastr';
import constants from '../constants/constants';
import { Iuser, IinitialState } from '../models';
import { ThunkAction } from 'redux-thunk';
// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getInventory(
  page: number,
  search: string,
  facilityID: string,
  manufacturerID: string,
  productGroupID: string
) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    return axios
      .get(API.GET.inventory.getinventory, {
        params: { page, search, facilityID, manufacturerID, productGroupID }
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_INVENTORY_SUCCESS,
            inventory: data.data[1]
          });
          dispatch({
            type: types.INVENTORY_TOTAL_PAGES,
            pages: data.data[0]
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_INVENTORY_FAILED });
        constants.handleError(error, 'get inventory');
        throw error;
      });
  };
}

export function updateUser(user: Iuser): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
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
          dispatch({ type: types.TOGGLE_MODAL_EDIT_TEAM });
          toastr.success('Success', 'Saved user', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.TEAM_UPDATE_FAILED });
        constants.handleError(error, 'update user');
        throw error;
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
          toastr.success('Success', 'Saved user', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.TEAM_SAVE_FAILED });
        constants.handleError(error, 'save user');
        throw error;
      });
  };
}

export const toggleEditInventoryModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_INVENTORY
});
