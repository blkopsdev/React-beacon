import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  IinitialState,
  ItableFiltersParams,
  Ireport,
  IdefaultReport
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getDefaultReports(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.report.defaults;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          console.log(data.data);
          dispatch({
            type: types.REPORT_MANAGE_GET_DEFAULT_SUCCESS,
            reports: data.data
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.REPORT_MANAGE_GET_DEFAULT_FAILED });
        constants.handleError(error, 'get default reports');
        console.error(error);
      });
  };
}

export function updateReport(
  selectedDefaultReport: IdefaultReport,
  formValues: any
): ThunkResult<void> {
  return (dispatch, getState) => {
    // dispatch(beginAjaxCall());
    const { jobID, coverLetter, headerLogoPath = '' } = formValues;
    const report: Ireport = {
      jobID,
      reportType: selectedDefaultReport.reportType,
      coverLetter,
      headerLogoPath
    };
    dispatch({
      type: types.REPORT_UPDATE,
      report
    });
    // return axios
    //   .post(`${API.POST.job.update}`, { job, users })
    //   .then(data => {
    //     if (!data.data) {
    //       throw undefined;
    //     } else {
    // dispatch({
    //   type: types.REPORT_UPDATE_SUCCESS,
    //   job: data.data
    // });

    //       // toastr.success('Success', 'Saved job', constants.toastrSuccess);
    //       return data;
    //     }
    //   })
    //   .catch((error: any) => {
    //     dispatch({ type: types.REPORT_UPDATE_FAILED });
    //     constants.handleError(error, 'update job');
    //     console.error(error);
    //   });
  };
}

/*
* run a new report
*/
export function runReport(
  formValues: any,
  reportType: number
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const reportTypeString = `report${
      constants.reportTypeEnumInverse[reportType]
    }`;
    const requestData: AxiosRequestConfig = {
      [reportTypeString]: {
        jobID: formValues.jobID.value,
        coverLetter: formValues.coverLetter,
        headerLogoPath: ''
      }
    };
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: requestData,
      headers: { Accept: 'application/pdf' },
      responseType: 'blob'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.report.run;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.REPORT_ADD_SUCCESS
          });
          // window.open(url, '_blank') // if opening in a new window is more important than custom filename

          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(
            new Blob([data.data], { type: 'application/pdf' })
          );
          const disposition = data.request.getResponseHeader(
            'content-disposition'
          );
          const matches = /"([^"]*)"/.exec(disposition);
          const filename =
            matches != null && matches[1] ? matches[1] : 'file.pdf';
          link.setAttribute('download', filename);
          link.setAttribute('target', '_blank');
          document.body.appendChild(link);
          link.click();

          dispatch({ type: types.TOGGLE_MODAL_EDIT_REPORT });
          toastr.success(
            'Success',
            'Report Downloaded',
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.REPORT_ADD_FAILED });
        constants.handleError(error, 'run report');
        console.error(error);
      });
  };
}

export const toggleEditReportModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_REPORT
});
export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_REPORT,
  filters
});

export const setSelectedReport = (report: Ireport) => ({
  type: types.SET_SELECTED_REPORT,
  report
});

export const setSelectedDefaultReport = (defaultReportID: string) => ({
  type: types.SET_SELECTED_DEFAULT_REPORT_ID,
  defaultReportID
});
