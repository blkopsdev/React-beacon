import { ThunkAction } from 'redux-thunk';
import axios from 'axios';

import {
  IinitialState,
  ImeasurementPointResult,
  ImeasurementPoint
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import * as moment from 'moment';
import { initialMeasurmentPointResult } from 'src/reducers/initialState';
import { values } from 'lodash';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getJobMeasurementPointResults(
  jobID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return getJobMeasurementPointResultsHelper(dispatch, getState, jobID);
  };
}

export const getJobMeasurementPointResultsHelper = (
  dispatch: any,
  getState: any,
  jobID: string
) => {
  return axios
    .get(`${API.GET.measurementPoint.getJobResults}/${jobID}`, {
      params: {
        pagingType: 'none'
      }
    })
    .then(data => {
      if (!data.data) {
        throw undefined;
      } else {
        // console.log(data.data);
        dispatch({
          type: types.GET_MEASUREMENT_POINT_JOB_RESULTS_SUCCESS,
          results: data.data
        });
        return data;
      }
    })
    .catch((error: any) => {
      console.error('error getting measurement point results', error);
      dispatch({ type: types.GET_MEASUREMENT_POINT_JOB_RESULTS_FAILED });
      constants.handleError(error, 'get inspection results');
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
      updateMPresultHelper(historicalResult, true, dispatch);
    } else {
      const previousResult = getPreviousResult(
        values(measurementPointResultsByID),
        installID
      );
      if (previousResult.id.length) {
        updateMPresultHelper(previousResult, false, dispatch);
      } else {
        console.log('No results for this install base.');
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
  console.error('updating result');
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
  installID: string
): ImeasurementPointResult => {
  if (mpResults) {
    const installResults = mpResults.filter(result => {
      return (
        result.installBaseID === installID &&
        result.measurementPointAnswers.length
      );
    });
    if (installResults && installResults.length) {
      console.log('we have install results with answers', installID);
      const mostRecentResult = installResults.reduce((previous, current) => {
        if (
          moment
            .utc(previous.updateDate)
            .isAfter(moment.utc(current.updateDate))
        ) {
          return previous;
        } else {
          return current;
        }
      });

      console.log('most recent result for this install: ', mostRecentResult);
      return mostRecentResult;
    } else {
      console.log('did not find any previous results');
      return initialMeasurmentPointResult;
    }
  } else {
    console.log('did not find any previous results');
    return initialMeasurmentPointResult;
  }
};
