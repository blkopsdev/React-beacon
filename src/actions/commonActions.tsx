import { toastr } from 'react-redux-toastr';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Icustomer, ICustomerImage, Ifacility, ThunkResult } from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import API from '../constants/apiEndpoints';
import { msalFetch } from 'src/components/auth/Auth-Utils';
import { FormUtil } from '../components/common/FormUtil';
import { initialCustomerImage } from '../reducers/initialState';

export const closeAllModals = () => ({
  type: types.CLOSE_ALL_MODALS
});
export const toggleEditCustomerModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_CUSTOMER
});
export const toggleEditFacilityModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_FACILITY
});

export function getFacilitiesByCustomer(customerID: string) {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { customerID }
    };

    const url = API.GET.facility.getbycustomer;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_FACILITIES_SUCCESS,
            facilities: data.data
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_FACILITIES_FAILED });
        constants.handleError(error, 'get facilities');
        console.error(error);
      });
  };
}

export function getCustomers() {
  return (dispatch: any, getState: any) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get',
      params: { pagingType: 'none' }
    };

    const url = API.GET.customer.getall;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.GET_CUSTOMERS_SUCCESS,
            customers: data.data.result
          });
          // dispatch({ type: types.USER_QUEUE_TOTAL_PAGES, pages: data.data[0] });
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.GET_CUSTOMERS_FAILED });
        constants.handleError(error, 'get companies');
        console.error(error);
      });
  };
}

export function addCustomer(customer: Icustomer): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: customer
    };

    const url = API.POST.customer.add;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch(
            addCustomerLogo({
              ...initialCustomerImage,
              customerID: customer.id,
              file: customer.file
            })
          );
          delete customer['logo'];
          dispatch({
            type: types.CUSTOMER_UPDATE_SUCCESS,
            customer: data.data
          });
          // dispatch({ type: types.TOGGLE_MODAL_EDIT_CUSTOMER });
          toastr.success('Success', 'Saved Customer', constants.toastrSuccess);
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.CUSTOMER_UPDATE_FAILED });
        constants.handleError(error, 'add customer');
        console.error(error);
      });
  };
}

export function updateCustomer(customer: Icustomer): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'put',
      data: customer
    };

    const url = API.PUT.customer.update.replace('{id}', customer.id);
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch(
          addCustomerLogo({
            ...initialCustomerImage,
            customerID: customer.id,
            file: customer.file
          })
        );
        delete customer['file'];
        dispatch({
          type: types.CUSTOMER_UPDATE_SUCCESS,
          customer: { ...customer }
        });
        // dispatch({ type: types.TOGGLE_MODAL_EDIT_CUSTOMER });
        toastr.success('Success', 'Update Customer', constants.toastrSuccess);
        return customer;
      })
      .catch((error: any) => {
        // dispatch({ type: types.CUSTOMER_UPDATE_FAILED });
        constants.handleError(error, 'Update customer');
        console.error(error);
      });
  };
}

export function addCustomerLogo(logo: ICustomerImage): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const headers = { 'content-type': 'multipart/form-data' };
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: FormUtil.toFormData(logo),
      headers
    };

    const url = API.POST.customer.addlogo;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.CUSTOMER_IMAGE_SAVE_SUCCESS,
            customerImage: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_CUSTOMER });
          toastr.success(
            'Success',
            'Saved Customer Logo',
            constants.toastrSuccess
          );
          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.CUSTOMER_UPDATE_FAILED });
        constants.handleError(error, 'add customer');
        console.error(error);
      });
  };
}

export function addFacility(facility: Ifacility): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'post',
      data: facility
    };

    const url = API.POST.facility.add;
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.FACILITY_UPDATE_SUCCESS,
            facility: data.data
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_FACILITY });
          toastr.success('Success', 'Saved Facility', constants.toastrSuccess);
          // wait for the select options to update then trigger an event that a new facility has been added.
          setTimeout(() => {
            const event = new CustomEvent('newFacility', {
              detail: data.data.id
            });
            document.dispatchEvent(event);
          }, 400);

          return data;
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.FACILITY_UPDATE_FAILED });
        constants.handleError(error, 'add facility');
        console.error(error);
      });
  };
}

export function updateFacility(facility: Ifacility): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'put',
      data: facility
    };

    const url = API.PUT.facility.update.replace('{id}', facility.id);
    return msalFetch(url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        dispatch({
          type: types.FACILITY_UPDATE_SUCCESS,
          facility: { ...facility }
        });
        dispatch({ type: types.TOGGLE_MODAL_EDIT_FACILITY });
        toastr.success('Success', 'Updated Facility', constants.toastrSuccess);
        // wait for the select options to update then trigger an event that a new facility has been added.
        setTimeout(() => {
          const event = new CustomEvent('newFacility', {
            detail: facility.id
          });
          document.dispatchEvent(event);
        }, 400);

        return facility;
      })
      .catch((error: any) => {
        dispatch({ type: types.FACILITY_UPDATE_FAILED });
        constants.handleError(error, 'update facility');
        console.error(error);
      });
  };
}
