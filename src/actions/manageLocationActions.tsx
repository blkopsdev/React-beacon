// import * as React from 'react';

import { ThunkAction } from 'redux-thunk';
// import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import { IinitialState, ItableFiltersParams } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';

// import {AxiosResponse} from 'axios';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getLocationsFacility(facilityID: string): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    return axios
      .get(`${API.GET.facility.getbyid}/${facilityID}`)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.LOCATION_MANAGE_SUCCESS,
            facility: data.data
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.LOCATION_MANAGE_FAILED });
        constants.handleError(error, 'get facility locations');
        throw error;
      });
  };
}

// export function updateProduct(
//   product: Iproduct,
//   queueID?: string
// ): ThunkResult<void> {
//   return (dispatch, getState) => {
//     dispatch(beginAjaxCall());
//     dispatch({ type: types.TOGGLE_MODAL_EDIT_PRODUCT });
//     return axios
//       .post(API.POST.inventory.updateproduct, product)
//       .then(data => {
//         if (!data.data) {
//           throw undefined;
//         } else {
//           dispatch({
//             type: types.PRODUCT_UPDATE_SUCCESS,
//             product: data.data,
//             queueID
//           });
//           // toastr.success('Success', 'Saved product', constants.toastrSuccess);
//         }
//       })
//       .catch((error: any) => {
//         dispatch({ type: types.PRODUCT_UPDATE_FAILED });
//         constants.handleError(error, 'update product');
//         throw error;
//       });
//   };
// }

/*
* save (add) a new product
*/
// export function saveProduct(product: Iproduct): ThunkResult<void> {
//   return (dispatch, getState) => {
//     dispatch(beginAjaxCall());
//     return axios
//       .post(API.POST.inventory.addproduct, product)
//       .then(data => {
//         if (!data.data) {
//           throw undefined;
//         } else {
//           dispatch({
//             type: types.PRODUCT_ADD_SUCCESS,
//             product: data.data
//           });
//           dispatch({ type: types.TOGGLE_MODAL_EDIT_PRODUCT });
//           toastr.success(
//             'Success',
//             'Submitted new product for approval.',
//             constants.toastrSuccess
//           );
//         }
//       })
//       .catch((error: any) => {
//         dispatch({ type: types.PRODUCT_ADD_FAILED });
//         constants.handleError(error, 'save product');
//         throw error;
//       });
//   };
// }

export const toggleEditLocationModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_LOCATION
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_LOCATION,
  filters
});
