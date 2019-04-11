import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { IinitialState, ItableFiltersParams, Ijob } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import * as moment from 'moment';
const uuidv4 = require('uuid/v4');
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';

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
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: {
        page,
        customerID: company && company.value,
        jobTypeID: type && type.value,
        startDate: startDate ? moment.utc(startDate).toISOString() : '',
        endDate: endDate ? moment.utc(endDate).toISOString() : ''
      }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.job.getall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: {}
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.jobtype.getall;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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

    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: {}
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.user.getfseusers;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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

export function updateJob(
  selectedJob: Ijob,
  formValues: any,
  users: string[]
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    dispatch({ type: types.TOGGLE_MODAL_EDIT_JOB });
    const job = {
      id: selectedJob.id,
      customerID: formValues.customerID.value,
      facilityID: formValues.facilityID.value,
      assignedUserID: formValues.assignedUserID.value,
      jobTypeID: formValues.jobTypeID.value,
      startDate: formValues.startDate.format(),
      endDate: formValues.endDate.format(),
      status: selectedJob.status,
      isDeleted: false
    };
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { job, users }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.job.update;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
export function createJob(formValues: any, users: string[]): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());

    const job: Ijob = {
      id: uuidv4(),
      customerID: formValues.customerID.value,
      facilityID: formValues.facilityID.value,
      assignedUserID: formValues.assignedUserID.value,
      jobTypeID: formValues.jobTypeID.value,
      startDate: formValues.startDate.format(),
      endDate: formValues.endDate.format(),
      status: 'New',
      isDeleted: false
    };
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: { job, users }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.job.create;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
