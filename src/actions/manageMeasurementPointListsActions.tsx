import { ThunkAction } from 'redux-thunk';
// import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import { IinitialState, ItableFiltersParams } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';
// import * as moment from 'moment';

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

// export function updateJob(job: Ijob, users: string[]): ThunkResult<void> {
//   return dispatch => {
//     dispatch(beginAjaxCall());
//     dispatch({ type: types.TOGGLE_MODAL_EDIT_JOB });
//     return axios
//       .post(`${API.POST.job.update}`, { job, users })
//       .then(data => {
//         if (!data.data) {
//           throw undefined;
//         } else {
//           dispatch({
//             type: types.JOB_UPDATE_SUCCESS,
//             job: data.data
//           });

//           // toastr.success('Success', 'Saved job', constants.toastrSuccess);
//           return data;
//         }
//       })
//       .catch((error: any) => {
//         dispatch({ type: types.JOB_UPDATE_FAILED });
//         constants.handleError(error, 'update job');
//         throw error;
//       });
//   };
// }

/*
* save (add) a new product
*/
// export function createJob(job: Ijob, users: string[]): ThunkResult<void> {
//   return (dispatch, getState) => {
//     dispatch(beginAjaxCall());
//     return axios
//       .post(API.POST.job.create, { job, users })
//       .then(data => {
//         if (!data.data) {
//           throw undefined;
//         } else {
//           dispatch({
//             type: types.JOB_ADD_SUCCESS,
//             job: data.data
//           });
//           dispatch({ type: types.TOGGLE_MODAL_EDIT_JOB });
//           toastr.success(
//             'Success',
//             'Created new job.',
//             constants.toastrSuccess
//           );
//         }
//       })
//       .catch((error: any) => {
//         dispatch({ type: types.JOB_ADD_FAILED });
//         constants.handleError(error, 'create job');
//         throw error;
//       });
//   };
// }

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
