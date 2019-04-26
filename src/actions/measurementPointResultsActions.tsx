import { ThunkAction } from 'redux-thunk';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  IinitialState,
  ImeasurementPointResult,
  ImeasurementPoint,
  ImeasurementPointList
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import * as moment from 'moment';
import { initialMeasurmentPointResult } from 'src/reducers/initialState';
import { values } from 'lodash';
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';

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
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  const url = `${
    API.GET.measurementPoint.getFacilityMeasurementPointListResults
  }/${facilityID}`;
  return adalFetch(authContext, resource, axios, url, axiosOptions).then(
    (data: AxiosResponse<any>) => {
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
    },
    (error: any) => {
      dispatch({ type: types.GET_MEASUREMENT_POINT_FACILITY_RESULTS_FAILED });
      constants.handleError(error, 'get inspection results');
      Promise.reject(error);
    }
  );
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
      updateMPresultHelper(historicalResult, true, dispatch);
    } else {
      const previousResult = getPreviousResult(
        values(measurementPointResultsByID),
        installID,
        selectedMeasurementPointList
      );
      if (previousResult.id.length) {
        updateMPresultHelper(previousResult, false, dispatch);
      } else {
        console.log('No results for this install base.');
        updateMPresultHelper(initialMeasurmentPointResult, false, dispatch);
      }
    }
  };
};

export function updateMeasurementPointResult(
  result: ImeasurementPointResult,
  historicalResult: boolean
): ThunkResult<void> {
  return (dispatch, getState) => {
    updateMPresultHelper(result, historicalResult, dispatch);
  };
}
const updateMPresultHelper = (
  result: ImeasurementPointResult,
  historicalResult: boolean,
  dispatch: any
) => {
  dispatch({
    type: types.UPDATE_MEASUREMENT_POINT_RESULT,
    result
  });
  if (historicalResult) {
    dispatch({
      type: types.SET_HISTORICAL_RESULT_ID,
      resultID: result.id
    });
  }
};

export const clearHistoricalResultID = () => ({
  type: types.CLEAR_HISTORICAL_RESULT_ID
});
export const resetSelectedResult = () => ({
  type: types.RESET_MEASUREMENT_POINT_RESULT
});

/*
* *********  Private Helper functions **********
*/

/*
* 1) try to find a previous result for this install 
* 2) try to find a previous result for this type of measurement point list (clean the answers)
* If we find one, return it
* Then set it to the selectedResult 
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
      previousResult = getMostRecentResult(MPLresults);
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
