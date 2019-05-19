import { beginAjaxCall } from './ajaxStatusActions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../constants/apiEndpoints';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import * as types from './actionTypes';
import { constants } from '../constants/constants';
import { toastr } from 'react-redux-toastr';
import { ItableFiltersParams, IAlert } from '../models';

export const getAlerts = () => async (dispatch: any, getState: any) => {
  dispatch(beginAjaxCall());
  const { page, title } = getState().manageAlert.tableFilters;
  const axiosOptions: AxiosRequestConfig = {
    method: 'get',
    params: { page, title }
  };

  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  const url = API.GET.alert.all;

  try {
    const data: AxiosResponse<any> = await adalFetch(
      authContext,
      resource,
      axios,
      url,
      axiosOptions
    );

    dispatch({ type: types.LOAD_ALERTS_SUCCESS, payload: data.data.result });
    dispatch({ type: types.ALERT_MANAGE_TOTAL_PAGES, pages: data.data.pages });
  } catch (error) {
    dispatch({ type: types.LOAD_ALERTS_SUCCESS });
    constants.handleError(error, 'get alerts');
  }
};

export const saveAlert = (alert: any) => async (dispatch: any) => {
  dispatch(beginAjaxCall());
  let headers = {};
  if (alert instanceof FormData) {
    headers = { 'content-type': 'multipart/form-data' };
  }
  const axiosOptions: AxiosRequestConfig = {
    method: 'post',
    data: alert,
    headers
  };
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  const url = API.POST.alert.create;

  try {
    const data: AxiosResponse<any> = await adalFetch(
      authContext,
      resource,
      axios,
      url,
      axiosOptions
    );

    const newAlert = { ...alert, ...data.data };
    dispatch({
      type: types.ADD_ALERT_SUCCESS,
      payload: newAlert
    });

    toastr.success('Success', `Created Alert.`, constants.toastrSuccess);
  } catch (error) {
    dispatch({ type: types.ADD_ALERT_FAILED });
    constants.handleError(error, 'ADD_ALERT_FAILED');
  }
};

export const updateAlert = (alert: FormData) => async (dispatch: any) => {
  dispatch(beginAjaxCall());
  let headers = {};
  if (alert instanceof FormData) {
    headers = { 'content-type': 'multipart/form-data' };
  }
  const axiosOptions: AxiosRequestConfig = {
    method: 'put',
    data: alert,
    headers
  };
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  const id = alert.get('id') as string;
  const url = API.PUT.alert.update.replace('{alertId}', id);

  try {
    const data: AxiosResponse<any> = await adalFetch(
      authContext,
      resource,
      axios,
      url,
      axiosOptions
    );
    dispatch({ type: types.EDIT_ALERT_SUCCESS, payload: data.data });
    toastr.success('Success', `Updated Alert.`, constants.toastrSuccess);
  } catch (error) {
    dispatch({ type: types.EDIT_ALERT_FAILED });
    constants.handleError(error, 'EDIT_ALERT_FAILED');
  }
};

export const deleteAlert = (alert: IAlert) => async (dispatch: any) => {
  dispatch(beginAjaxCall());
  const axiosOptions: AxiosRequestConfig = {
    method: 'delete'
  };
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  const url = API.DELETE.alert.delete.replace('{alertId}', alert.id);

  try {
    await adalFetch(authContext, resource, axios, url, axiosOptions);
    dispatch({ type: types.REMOVE_ALERT_SUCCESS, payload: alert });
    toastr.success('Success', `Deleted Alert.`, constants.toastrSuccess);
  } catch (error) {
    dispatch({ type: types.REMOVE_ALERT_FAILED });
    constants.handleError(error, 'REMOVE_ALERT_FAILED');
  }
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
