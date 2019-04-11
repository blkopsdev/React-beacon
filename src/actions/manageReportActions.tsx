import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig } from 'axios';

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

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getDefaultReports(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page } = getState().manageReport.tableFilters;
    return axios
      .get(API.GET.report.defaults, {
        params: {
          page
        }
      })
      .then(data => {
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
    const config: AxiosRequestConfig = {
      headers: { Accept: 'application/pdf' },
      responseType: 'blob'
    };
    return axios
      .post(API.POST.report.run, requestData, config)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.REPORT_ADD_SUCCESS
          });
          // const url = window.URL.createObjectURL(new File([data.data]));
          const url = window.URL.createObjectURL(
            new Blob([data.data], { type: 'application/pdf' })
          );
          // window.open(url, '_blank')

          const link = document.createElement('a');
          link.href = url;
          console.log(
            'request herder',
            data.request.getResponseHeader('content-disposition')
          );
          // link.setAttribute('download', 'file.pdf');
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
