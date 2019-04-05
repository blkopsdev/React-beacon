/*
* Measurement Point Results Reducer
* This reducer was copied from the mobile app
*/

import {
  ImeasurmentPointResultsReducer,
  ImeasurementPointResult
} from 'src/models';
import initialState, {
  initialMeasurmentPointResult,
  initialMeasurementPointResultAnswer
} from './initialState';
import * as types from '../actions/actionTypes';
import { keyBy, pickBy } from 'lodash';

const measurementPointResultsByIDReducer = (
  state: { [key: string]: ImeasurementPointResult } = {},
  action: any
): { [key: string]: ImeasurementPointResult } => {
  switch (action.type) {
    case types.ADD_MEASUREMENT_POINT_RESULT:
      return { ...state, [action.result.id]: cleanResult(action.result) };
    case types.UPDATE_MEASUREMENT_POINT_RESULT:
      return { ...state, [action.result.id]: cleanResult(action.result) };
    case types.GET_MEASUREMENT_POINT_FACILITY_RESULTS_SUCCESS:
      const newResults = keyBy(
        action.results.map((res: ImeasurementPointResult) => cleanResult(res)),
        'id'
      );
      return { ...state, ...newResults };
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
};

const selectedResultReducer = (
  state: ImeasurementPointResult = initialMeasurmentPointResult,
  action: any
): ImeasurementPointResult => {
  switch (action.type) {
    case types.ADD_MEASUREMENT_POINT_RESULT:
      return action.result;
    case types.UPDATE_MEASUREMENT_POINT_RESULT:
      // if this has been submitted to the server, it is no longer temporary and can no longer be edited.  Thus it should not be in the currentRestult reducer
      if (action.result.temporary === false) {
        console.log(
          'submitting a result, should we update selectedResultReducer?'
        );
        // return state;
      }
      if (state.id === action.result.id) {
        return { ...state, ...cleanResult(action.result) };
      } else {
        return cleanResult(action.result);
      }
    case types.RESET_MEASUREMENT_POINT_RESULT:
      return initialMeasurmentPointResult;
    case types.USER_LOGOUT_SUCCESS:
      return initialMeasurmentPointResult;
    default:
      return state;
  }
};

const previousResultReducer = (
  state: ImeasurementPointResult = initialMeasurmentPointResult,
  action: any
): ImeasurementPointResult => {
  switch (action.type) {
    case types.SET_PREVIOUS_RESULT:
      return action.result;
    case types.RESET_PREVIOUS_RESULT:
      return initialMeasurmentPointResult;
    case types.USER_LOGOUT_SUCCESS:
      return initialMeasurmentPointResult;
    default:
      return state;
  }
};

/*
* enable viewing of historical results
*/
const historicalResultIDReducer = (state: string = '', action: any): string => {
  switch (action.type) {
    case types.SET_HISTORICAL_RESULT_ID:
      return action.resultID;
    case types.CLEAR_HISTORICAL_RESULT_ID:
      return '';
    case types.USER_LOGOUT_SUCCESS:
      return '';
    default:
      return state;
  }
};

export default function measurementPointResultsReducer(
  state: ImeasurmentPointResultsReducer = initialState.measurementPointResults,
  action: any
): ImeasurmentPointResultsReducer {
  return {
    measurementPointResultsByID: measurementPointResultsByIDReducer(
      state.measurementPointResultsByID,
      action
    ),
    historicalResultID: historicalResultIDReducer(
      state.historicalResultID,
      action
    ),
    selectedResult: selectedResultReducer(state.selectedResult, action),
    previousResult: previousResultReducer(state.previousResult, action)
  };
}

const cleanResult = (
  result: ImeasurementPointResult
): ImeasurementPointResult => {
  const cleanedAnswers = result.measurementPointAnswers.map(answer => {
    return {
      ...initialMeasurementPointResultAnswer,
      ...pickBy(answer, (property, key) => property !== null)
    };
  });
  return {
    ...initialMeasurmentPointResult,
    ...pickBy(result, (property, key) => property !== null),
    measurementPointAnswers: cleanedAnswers
  };
};
