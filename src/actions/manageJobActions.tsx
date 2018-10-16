import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import { IinitialState, ItableFiltersParams, Ijob } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getJobs(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const {
      page,
      company,
      type,
      startDate,
      endDate
    } = getState().manageJob.tableFilters;
    return axios
      .get(API.GET.job.getall, {
        params: {
          page,
          company: company && company.value,
          type: type && type.value,
          startDate,
          endDate
        }
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.JOB_MANAGE_SUCCESS, jobs: data.data[1] });
          dispatch({
            type: types.JOB_MANAGE_TOTAL_PAGES,
            pages: data.data[0]
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.JOB_MANAGE_FAILED });
        constants.handleError(error, 'get jobs');
        throw error;
      });
  };
}

export function updateJob(job: Ijob): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_JOB });
    return axios
      .put(`${API.PUT.job.update}/${job.id}`, job)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.JOB_UPDATE_SUCCESS,
            job: data.data
          });

          // toastr.success('Success', 'Saved job', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.JOB_UPDATE_FAILED });
        constants.handleError(error, 'update job');
        throw error;
      });
  };
}

/*
* save (add) a new product
*/
export function createJob(job: Ijob): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.job.create, job)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.JOB_ADD_SUCCESS,
            product: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_JOB });
          toastr.success(
            'Success',
            'Created new job.',
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.JOB_ADD_FAILED });
        constants.handleError(error, 'create job');
        throw error;
      });
  };
}

export const toggleEditJobModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_JOB
});
export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_JOB,
  filters
});
