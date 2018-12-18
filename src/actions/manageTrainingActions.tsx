import { ThunkAction } from 'redux-thunk';
import axios from 'axios';

import { IinitialState, ItableFiltersParams } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';

// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getManageTraining(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageUser.tableFilters;
    return axios
      .get(API.GET.training.getAdminProgress, { params: { page, search } })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.MANAGE_TRAINING_SUCCESS,
            trainingProgress: data.data[1]
          });
          dispatch({
            type: types.MANAGE_TRAINING_TOTAL_PAGES,
            pages: data.data[0]
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.MANAGE_TRAINING_FAILED });
        constants.handleError(error, 'get user training progress');
        throw error;
      });
  };
}

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_TRAINING,
  filters
});
