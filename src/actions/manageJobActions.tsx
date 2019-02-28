import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import { IinitialState, ItableFiltersParams, Ijob } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import * as moment from 'moment';

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
          customerID: company && company.value,
          jobTypeID: type && type.value,
          startDate: startDate ? moment.utc(startDate).toISOString() : '',
          endDate: endDate ? moment.utc(endDate).toISOString() : ''
        }
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          console.log(data.data);
          dispatch({ type: types.JOB_MANAGE_SUCCESS, jobs: data.data.result });
          dispatch({
            type: types.JOB_MANAGE_TOTAL_PAGES,
            pages: data.data.pages
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.JOB_MANAGE_FAILED });
        constants.handleError(error, 'get jobs');
        console.error(error);
      });
  };
}

export function getJobTypes(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .get(API.GET.jobtype.getall, {
        params: {}
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_JOBTYPES_SUCCESS,
            jobTypes: data.data.result
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_JOBTYPES_FAILED });
        constants.handleError(error, 'get jobtypes');
        console.error(error);
      });
  };
}

export function getFSEUsers(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .get(API.GET.user.getfseusers, {
        params: {}
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_FSE_SUCCESS,
            users: data.data
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_FSE_FAILED });
        constants.handleError(error, 'get fse users');
        console.error(error);
      });
  };
}

export function updateJob(job: Ijob, users: string[]): ThunkResult<void> {
  return dispatch => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_JOB });
    return axios
      .post(`${API.POST.job.update}`, { job, users })
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
        console.error(error);
      });
  };
}

/*
* save (add) a new product
*/
export function createJob(job: Ijob, users: string[]): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .post(API.POST.job.create, { job, users })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.JOB_ADD_SUCCESS,
            job: data.data
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
        console.error(error);
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
