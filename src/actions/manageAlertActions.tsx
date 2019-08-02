import { beginAjaxCall } from './ajaxStatusActions';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { msalFetch } from '../components/auth/Auth-Utils';

import * as types from './actionTypes';
import { constants } from '../constants/constants';
import { toastr } from 'react-redux-toastr';
import { ItableFiltersParams, IAlert, IinitialState } from '../models';
import { ThunkAction } from 'redux-thunk';
import { FormUtil } from '../components/common/FormUtil';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export const getAlerts = (): ThunkResult<void> => {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const { page, title, type } = getState().manageAlert.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, title, type }
    };

    const url = API.GET.alert.search;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw new Error('missing data');
        } else {
          dispatch({
            type: types.LOAD_ALERTS_SUCCESS,
            payload: data.data.result
          });
          dispatch({
            type: types.ALERT_MANAGE_TOTAL_PAGES,
            pages: data.data.pages
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.LOAD_ALERTS_SUCCESS });
        constants.handleError(error, 'get alerts');
      });
  };
};

export const saveAlert = (alert: IAlert): ThunkResult<void> => (
  dispatch,
  getState
) => {
  dispatch(beginAjaxCall());
  const headers = { 'content-type': 'multipart/form-data' };

  const axiosOptions: AxiosRequestConfig = {
    method: 'post',
    data: FormUtil.toFormData(alert),
    headers
  };

  const url = API.POST.alert.create;
  return msalFetch(url, axiosOptions)
    .then((data: AxiosResponse<any>) => {
      if (!data.data) {
        throw new Error('missing data');
      } else {
        const newAlert = { ...alert, ...data.data };
        dispatch({
          type: types.ADD_ALERT_SUCCESS,
          payload: newAlert
        });
        toastr.success('Success', `Created Alert.`, constants.toastrSuccess);
        dispatch({ type: types.TOGGLE_MODAL_EDIT_ALERT });
      }
    })
    .catch((error: any) => {
      dispatch({ type: types.ADD_ALERT_FAILED });
      constants.handleError(error, 'ADD_ALERT_FAILED');
    });
};

export const updateAlert = (
  alert: any,
  selectedAlert: IAlert
): ThunkResult<void> => dispatch => {
  dispatch(beginAjaxCall());
  const headers = { 'content-type': 'multipart/form-data' };

  alert['id'] = selectedAlert.id;
  const axiosOptions: AxiosRequestConfig = {
    method: 'put',
    data: FormUtil.toFormData(alert),
    headers
  };

  const url = `${API.PUT.alert.update}/${selectedAlert.id}`;
  return msalFetch(url, axiosOptions)
    .then((data: AxiosResponse<any>) => {
      if (!data.data) {
        throw new Error('missing data');
      } else {
        dispatch({ type: types.EDIT_ALERT_SUCCESS, payload: data.data });
        toastr.success('Success', `Updated Alert.`, constants.toastrSuccess);
        dispatch({ type: types.TOGGLE_MODAL_EDIT_ALERT });
      }
    })
    .catch((error: any) => {
      dispatch({ type: types.EDIT_ALERT_FAILED });
      constants.handleError(error, 'EDIT_ALERT_FAILED');
    });
};

export const deleteAlert = (alert: IAlert): ThunkResult<void> => dispatch => {
  dispatch(beginAjaxCall());
  const axiosOptions: AxiosRequestConfig = {
    method: 'delete'
  };

  const url = `${API.DELETE.alert.delete}/${alert.id}`;

  return msalFetch(url, axiosOptions)
    .then((data: AxiosResponse<any>) => {
      dispatch({ type: types.REMOVE_ALERT_SUCCESS, payload: alert });
      toastr.success('Success', `Deleted Alert.`, constants.toastrSuccess);
    })
    .catch((error: any) => {
      dispatch({ type: types.REMOVE_ALERT_FAILED });
      constants.handleError(error, 'REMOVE_ALERT_FAILED');
    });
};

export const setSelectedAlertID = (id: string) => ({
  type: types.SET_SELECTED_ALERT_ID,
  id
});

export const clearSelectedAlertID = () => ({
  type: types.CLEAR_SELECTED_ALERT_ID
});

export const toggleEditAlertModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_ALERT
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_ALERT,
  filters
});

export const setAlertFormValues = (formValues: any) => ({
  type: types.SET_FORM_VALUES_MANAGE_ALERT,
  formValues
});

export const updateAlertFormValue = (formValue: any) => ({
  type: types.UPDATE_FORM_VALUES_MANAGE_ALERT,
  formValue
});
