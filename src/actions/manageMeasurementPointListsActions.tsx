import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import {
  IinitialState,
  ItableFiltersParams,
  ImeasurementPointQuestion,
  ImeasurementPointList
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';
// import * as moment from 'moment';
import { map } from 'lodash';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getAllMeasurementPointLists(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const {
      page,
      type,
      productGroup,
      standard
    } = getState().manageMeasurementPointLists.tableFilters;
    return axios
      .get(API.GET.measurements.getall, {
        params: {
          page,
          productGroupID: productGroup && productGroup.value,
          type: type && type.value,
          standardID: standard && standard.value
        }
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          // console.log(data.data);
          dispatch({
            type: types.MANAGE_MEASUREMENT_POINT_LISTS_SUCCESS,
            measurements: data.data.result
          });
          dispatch({
            type: types.MANAGE_MEASUREMENT_POINT_LISTS_TOTAL_PAGES,
            pages: data.data.pages
          });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.MANAGE_MEASUREMENT_POINT_LISTS_FAILED });
        constants.handleError(error, 'get measurements');
        throw error;
      });
  };
}

export const setSelectedMeasurementPointList = (
  measurementPointList: ImeasurementPointList
) => ({
  type: types.SELECT_MEASUREMENT_POINT_LIST,
  measurementPointList
});

export const addQuestionToMeasurementPointList = (
  list: ImeasurementPointList,
  question: ImeasurementPointQuestion
) => ({
  type: types.MANAGE_MEASUREMENT_POINT_QUESTION_ADD,
  list,
  question
});

/*
* save (add) a new mpl
*/
export function addGlobalMeasurementPointList(
  mpl: ImeasurementPointList
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const measurementPoints = map(mpl.measurementPoints, mp => mp);
    return axios
      .post(API.POST.measurements.addglobalmpl, { ...mpl, measurementPoints })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.MANAGE_MEASUREMENT_POINT_LIST_ADD_SUCCESS,
            measurementPointList: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_LISTS });
          toastr.success(
            'Success',
            'Created new measurement point list.',
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.MANAGE_MEASUREMENT_POINT_LIST_ADD_FAILED });
        constants.handleError(error, 'create measurement point list');
        throw error;
      });
  };
}

/*
* update a mpl
*/
export function updateGlobalMeasurementPointList(
  mpl: ImeasurementPointList
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const measurementPoints = map(mpl.measurementPoints, mp => mp);
    return axios
      .put(`${API.PUT.measurements.updateglobalmpl}/${mpl.id}`, {
        ...mpl,
        measurementPoints
      })
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE_SUCCESS,
            measurementPointList: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_LISTS });
          toastr.success(
            'Success',
            'Updated measurement point list.',
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE_FAILED });
        constants.handleError(error, 'update measurement point list');
        throw error;
      });
  };
}

/*
* delete a mpl
*/
export function deleteGlobalMeasurementPointList(
  measurementPointListId: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .delete(
        `${API.DELETE.measurements.deleteglobalmpl}/${measurementPointListId}`
      )
      .then(data => {
        dispatch({
          type: types.MANAGE_MEASUREMENT_POINT_LIST_DELETE_SUCCESS,
          measurementPointListId
        });
        toastr.success(
          'Success',
          'Deleted measurement point list.',
          constants.toastrSuccess
        );
      })
      .catch((error: any) => {
        dispatch({ type: types.MANAGE_MEASUREMENT_POINT_LIST_DELETE_FAILED });
        constants.handleError(error, 'delete measurement point list');
        throw error;
      });
  };
}

export const toggleEditMeasurementPointListModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_LISTS
});
export const toggleEditMeasurementPointQuestionModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_QUESTION
});
export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_MEASUREMENT_POINT_LISTS,
  filters
});
