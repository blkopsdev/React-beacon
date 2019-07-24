import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  IinitialState,
  ItableFiltersParams,
  ImeasurementPoint,
  ImeasurementPointList,
  ImeasurementPointListTab
} from '../models';
import { beginAjaxCall, endAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
// import * as moment from 'moment';
import { filter, values } from 'lodash';
import { initialMeasurementPointList } from 'src/reducers/initialState';
import { msalFetch } from 'src/components/auth/Auth-Utils';
import { Dispatch } from 'react-redux';
import { TranslationFunction } from 'i18next';

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
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: {
        page,
        mainCategoryID: mainCategory && mainCategory.value,
        type: type && type.value,
        standardID: standard && standard.value
      }
    };

    const url = API.GET.measurementPoint.getall;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          // console.log(data.data);
          dispatch({
            type: types.MANAGE_MEASUREMENT_POINT_LISTS_SUCCESS,
            measurementPointLists: data.data.result
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
        constants.handleError(error, 'get measurement point lists');
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

    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: listForAPI
    };

    const url = API.POST.measurementPoint.addglobalmpl;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch(endAjaxCall());
          dispatch({
            type: types.MANAGE_MEASUREMENT_POINT_LIST_ADD,
            measurementPointList: mpl
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
        console.error(error);
      });
  };
}

/*
* update a tab
*/
export function updateMeasurementPointListTab(
  tab: ImeasurementPointListTab
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch({
      type: types.MANAGE_MEASUREMENT_POINT_TAB_UPDATE,
      tab
    });
    if (tab.isDeleted === true) {
      dispatch({
        type: types.MANAGE_MEASUREMENT_POINT_SET_SELECTED_TAB,
        selectedTabID: ''
      });
    }
  };
}
/*
* update a mpl
*/
export function updateGlobalMeasurementPointList(
  mpl: ImeasurementPointList,
  persistToAPI: boolean,
  isCustomer: boolean
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch({
      type: types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE,
      measurementPointList: mpl,
      persistToAPI
    });
    if (persistToAPI) {
      dispatch(beginAjaxCall());
      // convert the measementPoints back to an array
      const measurementPointTabs = mpl.measurementPointTabs.map(tab => {
        return { ...tab, measurementPoints: values(tab.measurementPoints) };
      });
      const listForAPI = { ...mpl, measurementPointTabs };

      // Set the correct URL dependent on if this is a customer or not
      let url = `${API.PUT.measurementPoint.updateglobalmpl}/${mpl.id}`;
      if (isCustomer) {
        url = `${API.PUT.measurementPoint.updatecustomermpl}/${mpl.id}`;
      }
      const axiosOptions: AxiosRequestConfig = {
        method: 'put',
        data: listForAPI
      };

      return msalFetch(url, axiosOptions).then(
        (data: AxiosResponse<any>) => {
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
        },
        (error: any) => {
          dispatch({ type: types.MANAGE_MEASUREMENT_POINT_LIST_UPDATE_FAILED });
          constants.handleError(error, 'update measurement point list');
          throw error;
        }
      );
    } else {
      return Promise.resolve(true);
    }
  };
}

export function deleteMeasurementPoint(
  measurementPointID: string,
  measurementPointListID: string,
  selectedTabID: string,
  t: TranslationFunction
): ThunkResult<void> {
  return (dispatch, getState) => {
    const measurementPointListsByID = getState().manageMeasurementPointLists
      .data;
    const selectedMeasurementPointList =
      measurementPointListsByID[measurementPointListID];
    const selectedTab = selectedMeasurementPointList.measurementPointTabs.find(
      tab => tab.id === selectedTabID
    );
    if (!selectedTab) {
      throw new Error('missing selected measurement point tab');
    }
    const selectedMeasurementPoint =
      selectedTab.measurementPoints[measurementPointID];

    const toastrConfirmOptions = {
      onOk: () => {
        saveMeasurementPointToMeasurementPointListHelper(
          measurementPointListID,
          selectedTabID,
          { ...selectedMeasurementPoint, isDeleted: true },
          dispatch,
          getState
        );
        dispatch({
          type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT
        });
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: t('deleteMeasurementPointOk'),
      cancelText: t('common:cancel')
    };
    toastr.confirm(t('deleteConfirmMP'), toastrConfirmOptions);
  };
}

export function deleteGlobalMeasurementPointList(
  MPlistID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    const axiosOptions: AxiosRequestConfig = {
      method: 'delete'
    };

    const url = `${API.DELETE.measurementPoint.deleteglobalmpl}/${MPlistID}`;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.MANAGE_MEASUREMENT_POINT_LIST_DELETE_SUCCESS,
            MPlistID
          });
          toastr.success(
            'Success',
            'Deleted measurement point list.',
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.MANAGE_MEASUREMENT_POINT_LIST_DELETE_FAILED });
        constants.handleError(error, 'delete measurement point list');
        console.error(error);
      });
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'put',
      data: listForAPI
    };

    const url = `${API.PUT.measurementPoint.updatecustomermpl}/${mpl.id}`;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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

export const saveMeasurementPointToMeasurementPointListHelper = (
  listID: string,
  selectedTabID: string,
  measurementPoint: ImeasurementPoint,
  dispatch: Dispatch,
  getState: () => IinitialState
) => {
  dispatch({
    type: types.MANAGE_MEASUREMENT_POINT_SAVE_TO_LIST,
    listID,
    selectedTabID,
    measurementPoint
  });
};

/*
* Get a specific measurement point list
* TODO verify we are receiving deleted MPs here
*/
export function getMeasurementPointList(MPlistID: string): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };

    const url = `${
      API.GET.measurementPoint.getMeasurementPointList
    }/${MPlistID}`;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.MEASUREMENT_POINT_LIST_SUCCESS,
            list: data.data
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.MEASUREMENT_POINT_LIST_FAILED });
        constants.handleError(error, 'get a measurement point list');
        console.error(error);
      });
  };
}

export const toggleEditMeasurementPointListModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_LISTS
});
export const toggleEditMeasurementPointModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT
});
export const toggleEditMeasurementPointTabModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_TAB
});
export const toggleEditMeasurementPointListTestProceduresModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_MEASUREMENT_POINT_LIST_TEST_PROCEDURES
});
export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_MEASUREMENT_POINT_LISTS,
  filters
});
export const setSelectedTabID = (selectedTabID: string) => ({
  type: types.MANAGE_MEASUREMENT_POINT_SET_SELECTED_TAB,
  selectedTabID
});
