import { ThunkAction } from 'redux-thunk';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { IinitialState, ItableFiltersParams } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import { msalFetch } from 'src/components/auth/Auth-Utils';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getManageTraining(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, search } = getState().manageTraining.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, search }
    };

    const url = API.GET.training.getAdminProgress;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.MANAGE_TRAINING_SUCCESS,
            trainingProgress: data.data.result
          });
          dispatch({
            type: types.MANAGE_TRAINING_TOTAL_PAGES,
            pages: data.data.pages
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.MANAGE_TRAINING_FAILED });
        constants.handleError(error, 'get user training progress');
        console.error(error);
      });
  };
}

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_TRAINING,
  filters
});
