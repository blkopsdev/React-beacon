import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import {
  IinitialState,
  ItableFiltersParams,
  ImeasurementPoint,
  ImeasurementPointList
} from '../models';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
// import * as moment from 'moment';
import { filter, values } from 'lodash';
import { initialMeasurementPointList } from 'src/reducers/initialState';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getAllMeasurementPointLists(): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const {
      page,
      type,
      mainCategory,
      standard
    } = getState().manageMeasurementPointLists.tableFilters;
    return axios
      .get(API.GET.measurements.getall, {
        params: {
          page,
          mainCategoryID: mainCategory && mainCategory.value,
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
        console.error(error);
      });
  };
}

export const setSelectedMeasurementPointList = (
  measurementPointList: ImeasurementPointList
) => ({
  type: types.SELECT_MEASUREMENT_POINT_LIST,
  measurementPointList
});

/*
* save (add) a new mpl
*/
export function addGlobalMeasurementPointList(
  mpl: ImeasurementPointList
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());

    // convert the measementPoints back to an array
    const measurementPointTabs = mpl.measurementPointTabs.map(tab => {
      return { ...tab, measurementPoints: values(tab.measurementPoints) };
    });
    const listForAPI = { ...mpl, measurementPointTabs };

    dispatch({
      type: types.MANAGE_MEASUREMENT_POINT_LIST_ADD,
      measurementPointList: mpl
    });

    return axios
      .post(API.POST.measurements.addglobalmpl, listForAPI)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch(endAjaxCall());
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
        console.error(error);
      });
  };
}

/*
* update a mpl
*/
export function updateGlobalMeasurementPointList(
  mpl: ImeasurementPointList,
  persistToAPI: boolean
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch({
      type: types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE,
      measurementPointList: mpl
    });
    if (persistToAPI) {
      dispatch(beginAjaxCall());
      // convert the measementPoints back to an array
      const measurementPointTabs = mpl.measurementPointTabs.map(tab => {
        return { ...tab, measurementPoints: values(tab.measurementPoints) };
      });
      const listForAPI = { ...mpl, measurementPointTabs };
      return axios
        .put(`${API.PUT.measurements.updateglobalmpl}/${mpl.id}`, listForAPI)
        .then(data => {
          if (!data.data) {
            throw undefined;
          } else {
            dispatch(endAjaxCall());
            dispatch({ type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_LISTS });
            dispatch({
              type: types.SELECT_MEASUREMENT_POINT_LIST,
              measurementPointList: initialMeasurementPointList
            });
            dispatch({
              type: types.MANAGE_MEASUREMENT_POINT_SET_SELECTED_TAB,
              selectedTabID: ''
            });
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
          console.error(error);
        });
    } else {
      return Promise.resolve(true);
    }
  };
}

// CUSTOMER MP endpoints

/*
* update the entire mpl locally but send only the customer MPs to the API
*/
export function updateCustomerMeasurementPointList(
  mpl: ImeasurementPointList
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());

    // convert the measementPoints back to an array
    const measurementPointTabs = mpl.measurementPointTabs.map(tab => {
      return {
        ...tab,
        measurementPoints: filter(
          tab.measurementPoints,
          mp => mp.customerID.length > 0
        )
      };
    });
    const listForAPI = { ...mpl, measurementPointTabs };

    dispatch({
      type: types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE,
      measurementPointList: mpl
    });

    return axios
      .put(`${API.PUT.measurements.updatecustomermpl}/${mpl.id}`, listForAPI)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch(endAjaxCall());
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
* update the selected Measurement Point
*/
export const updateMeasurementPoint = (
  measurementPoint: ImeasurementPoint,
  selectedTabID: string
) => ({
  type: types.MANAGE_MEASUREMENT_POINT_UPDATE,
  measurementPoint,
  selectedTabID
});

export const saveMeasurementPointToMeasurementPointList = (
  listID: string,
  selectedTabID: string,
  measurementPoint: ImeasurementPoint
) => ({
  type: types.MANAGE_MEASUREMENT_POINT_SAVE_TO_LIST,
  listID,
  selectedTabID,
  measurementPoint
});

export const toggleEditMeasurementPointListModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_LISTS
});
export const toggleEditMeasurementPointModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT
});
export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_MEASUREMENT_POINT_LISTS,
  filters
});
export const setSelectedTabID = (selectedTabID: string) => ({
  type: types.MANAGE_MEASUREMENT_POINT_SET_SELECTED_TAB,
  selectedTabID
});
