import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';
import { toastr } from 'react-redux-toastr';
import { ItableFiltersParams, IAlert } from '../models';

export function getAlerts() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const { page, title } = getState().manageAlert.tableFilters;
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { page, title }
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.GET.alert.all;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({ type: types.LOAD_ALERTS_SUCCESS, payload: data.data });
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
        console.error(error);
      });
  };
}

export function saveAlert(alert: IAlert) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: alert
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.POST.alert.create;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          const newAlert = { ...alert, id: data.data };
          dispatch({
            type: types.ADD_ALERT_SUCCESS,
            payload: newAlert
          });
          toastr.success('Success', `Created Alert.`, constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.ADD_ALERT_FAILED });
        constants.handleError(error, 'ADD_ALERT_FAILED');
        console.error(error);
      });
  };
}

export function updateAlert(alert: IAlert) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'put',
      data: alert
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.PUT.alert.update.replace('{alertId}', alert.id);
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.EDIT_ALERT_SUCCESS,
            payload: alert
          });

          toastr.success('Success', `Updated Alert.`, constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.EDIT_ALERT_FAILED });
        constants.handleError(error, 'EDIT_ALERT_FAILED');
        console.error(error);
      });
  };
}

export function deleteAlert(alert: IAlert) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'delete'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = API.DELETE.alert.delete.replace('{alertId}', alert.id);
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.REMOVE_ALERT_SUCCESS,
            payload: alert
          });
          toastr.success('Success', `Deleted Alert.`, constants.toastrSuccess);
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.REMOVE_ALERT_FAILED });
        constants.handleError(error, 'REMOVE_ALERT_FAILED');
        console.error(error);
      });
  };
}

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
