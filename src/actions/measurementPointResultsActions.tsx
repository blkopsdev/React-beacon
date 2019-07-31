import { ThunkAction } from 'redux-thunk';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  IinitialState,
  ImeasurementPointResult,
  ImeasurementPoint,
  ImeasurementPointList
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from '../constants/constants';
import * as types from './actionTypes';
import * as moment from 'moment';
import { initialMeasurmentPointResult } from '../reducers/initialState';
import { values } from 'lodash';
import { msalFetch } from '../components/auth/Auth-Utils';

import { Dispatch } from 'react-redux';
const uuidv4 = require('uuid/v4');

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getFacilityMeasurementPointResults(
  facilityID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return getFacilityMeasurementPointResultsHelper(
      dispatch,
      getState,
      facilityID
    ).catch((error: any) =>
      console.error('error getting measurement point results', error)
    );
  };
}

export const getFacilityMeasurementPointResultsHelper = (
  dispatch: any,
  getState: any,
  facilityID: string
) => {
  const axiosOptions: AxiosRequestConfig = {
    method: 'get'
  };

  const url = `${
    API.GET.measurementPoint.getFacilityMeasurementPointListResults
  }/${facilityID}`;
  return msalFetch(url, axiosOptions)
    .then((data: AxiosResponse<any>) => {
      if (!data.data) {
        throw undefined;
      } else {
        // console.log(data.data);
        dispatch({
          type: types.GET_MEASUREMENT_POINT_FACILITY_RESULTS_SUCCESS,
          results: data.data
        });
        return data;
      }
    })
    .catch((error: any) => {
      dispatch({ type: types.GET_MEASUREMENT_POINT_FACILITY_RESULTS_FAILED });
      constants.handleError(error, 'get inspection results');
      throw error; // intentionally rethrow
    });
};

/*
* get the most recent or the selected historical result for this installBase
*/
export const selectResult = (installID: string): ThunkResult<void> => {
  return (dispatch, getState) => {
    const {
      selectedMeasurementPointList
    } = getState().manageMeasurementPointLists;
    const {
      historicalResultID,
      measurementPointResultsByID
    } = getState().measurementPointResults;
    let measurementPointsByID: { [key: string]: ImeasurementPoint } = {};
    selectedMeasurementPointList.measurementPointTabs.forEach(tab => {
      measurementPointsByID = {
        ...measurementPointsByID,
        ...tab.measurementPoints
      };
    });
    if (historicalResultID.length) {
      const historicalResult = measurementPointResultsByID[historicalResultID];
      updateMPresultHelper(historicalResult, dispatch);
    } else {
      const previousResult = getPreviousResult(
        values(measurementPointResultsByID),
        installID,
        selectedMeasurementPointList
      );
      if (previousResult.id.length) {
        updateMPresultHelper(previousResult, dispatch);
      } else {
        console.log('No results for this install base.');
        updateMPresultHelper(initialMeasurmentPointResult, dispatch);
      }
    }
  };
};

export function submitMeasurementPointResult(
  formValues: any,
  installBaseID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    submitMeasurementPointResultHelper(dispatch, formValues, installBaseID);
  };
}
const submitMeasurementPointResultHelper = (
  dispatch: Dispatch,
  formValues: any,
  installBaseID: string
) => {
  // toastr.success('Tests submitted successfully', '', constants.toastrSuccess);
  const result: ImeasurementPointResult = {
    ...initialMeasurmentPointResult,
    temporary: false,
    createDate: moment.utc().toISOString(),
    id: uuidv4(),
    notes: formValues.notes || '',
    status: formValues.status ? parseInt(formValues.status.value, 10) : 0,
    installBaseID,
    manualStatusOverride: true
  };
  const axiosRequest = {
    url: API.POST.measurementPoint.addResults,
    method: 'post',
    data: result
  };
  dispatch({
    type: types.UPDATE_MEASUREMENT_POINT_RESULT,
    result,
    meta: {
      offline: {
        effect: { axiosRequest, message: 'submit tests' },
        rollback: {
          type: types.UPDATE_MEASUREMENT_POINT_RESULT,
          result: { ...result, temporary: true }
        }
      }
    }
  });
};

export function updateMeasurementPointResult(
  result: ImeasurementPointResult
): ThunkResult<void> {
  return (dispatch, getState) => {
    updateMPresultHelper(result, dispatch);
  };
}
const updateMPresultHelper = (
  result: ImeasurementPointResult,
  dispatch: Dispatch
) => {
  dispatch({
    type: types.UPDATE_MEASUREMENT_POINT_RESULT,
    result
  });
};

export function setHistoricalResultID(resultID: string): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch({
      type: types.SET_HISTORICAL_RESULT_ID,
      resultID
    });
  };
}

export const clearHistoricalResultID = () => ({
  type: types.CLEAR_HISTORICAL_RESULT_ID
});

/*
* *********  Private Helper functions **********
*/

/*
* 1) try to find a previous result for this install 
* 2) try to find a previous result for this type of measurement point list (clean the answers)
* If we find one, return it
*  - if it is temporary then do Not create a new ID or remove any answers
*/
const getPreviousResult = (
  mpResults: ImeasurementPointResult[],
  installID: string,
  selectedMPL: ImeasurementPointList
): ImeasurementPointResult => {
  if (mpResults.length) {
    let previousResult: ImeasurementPointResult = initialMeasurmentPointResult;
    const installResults = getInstallResults(mpResults, false, installID);
    if (installResults && installResults.length) {
      previousResult = getMostRecentResult(installResults);
    } else {
      const MPLresults = getMeasurementPointListResults(mpResults, selectedMPL);
      if (MPLresults.length) {
        previousResult = getMostRecentResult(MPLresults);
      }
    }
    return previousResult;
  } else {
    console.log('did not find any previous results');
    return initialMeasurmentPointResult;
  }
};

/*
* when no results for the specific install, try to find results for the same measurementPointList
*/
const getMeasurementPointListResults = (
  results: ImeasurementPointResult[],
  selectedMPL: ImeasurementPointList
) => {
  return results.filter(result => {
    return (
      result.measurementPointListID === selectedMPL.id && !result.temporary
    );
  });
};

const getInstallResults = (
  results: ImeasurementPointResult[],
  includeTemporary: boolean,
  installID: string
) => {
  const filteredResults = results.filter(result => {
    return result.installBaseID === installID;
  });
  if (!includeTemporary) {
    return filteredResults.filter(result => result.temporary !== true);
  }
  return filteredResults;
};

const getMostRecentResult = (results: ImeasurementPointResult[]) => {
  return results.reduce((previous, current) => {
    if (
      moment.utc(previous.updateDate).isAfter(moment.utc(current.updateDate))
    ) {
      return previous;
    } else {
      return current;
    }
  });
};
