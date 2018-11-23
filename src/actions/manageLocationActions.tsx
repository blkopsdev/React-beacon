// import * as React from 'react';

import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';

import {
  IinitialState,
  ItableFiltersParams,
  Ibuilding,
  Ifloor,
  Ilocation,
  Iroom
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import constants from '../constants/constants';
import * as types from './actionTypes';
import { find } from 'lodash';

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

/*
* save (add) a new building/floor/location/room
*/
export function saveAnyLocation(
  item: any,
  lType: 'Building' | 'Floor' | 'Location' | 'Room',
  facilityID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    let url: string;
    if (lType === 'Building') {
      url = API.POST.building;
    } else if (lType === 'Floor') {
      url = API.POST.floor;
    } else if (lType === 'Location') {
      url = API.POST.location;
    } else {
      url = API.POST.room;
    }
    return axios
      .post(url, item)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.LOCATION_ADD_SUCCESS,
            lType,
            item
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_LOCATION });
          toastr.success(
            'Success',
            `Created new ${lType}.`,
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.LOCATION_ADD_FAILED });
        constants.handleError(error, `save ${lType}`);
        throw error;
      });
  };
}

/*
* update (edit) a building/floor/location/room
*/
export function updateAnyLocation(item: any, lType: string): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    let url: string;
    if (lType === 'Building') {
      url = `${API.PUT.building}/${item.id}`;
    } else if (lType === 'Floor') {
      url = `${API.PUT.floor}/${item.id}`;
    } else if (lType === 'Location') {
      url = `${API.PUT.location}/${item.id}`;
    } else {
      url = `${API.PUT.room}/${item.id}`;
    }
    return axios
      .put(url, item)
      .then(data => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.LOCATION_UPDATE_SUCCESS,
            lType,
            item
          });
          dispatch({ type: types.TOGGLE_MODAL_EDIT_LOCATION });
          toastr.success(
            'Success',
            `Updated ${lType}.`,
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.LOCATION_UPDATE_FAILED });
        constants.handleError(error, `update ${lType}`);
        throw error;
      });
  };
}

/*
* update (edit) a building/floor/location/room
*/
export function deleteAnyLocation(item: any, lType: string): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    let url: string;
    if (lType === 'Building') {
      url = `${API.DELETE.building}/${item.id}`;
    } else if (lType === 'Floor') {
      url = `${API.DELETE.floor}/${item.id}`;
    } else if (lType === 'Location') {
      url = `${API.DELETE.location}/${item.id}`;
    } else {
      url = `${API.DELETE.room}/${item.id}`;
    }
    return axios
      .delete(url)
      .then(data => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.LOCATION_DELETE_SUCCESS,
            lType,
            item
          });
          toastr.success(
            'Success',
            `Deleted ${lType}.`,
            constants.toastrSuccess
          );
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.LOCATION_DELETE_FAILED });
        constants.handleError(error, `delete ${lType}`);
        throw error;
      });
  };
}

export const setSelectedBuilding = (building: Ibuilding): ThunkResult<void> => {
  return (dispatch, getState) => {
    let item = building;
    const buildingID = building.id;

    const { buildings } = getState().manageLocation.facility;
    const buildingB = find(buildings, build => build.id === buildingID);
    if (buildingB) {
      item = buildingB;
    }

    dispatch({
      type: types.SET_SELECTED_BUILDING,
      item
    });
  };
};

export const setSelectedFloor = (
  floor: Ifloor,
  facilityID: string
): ThunkResult<void> => {
  return (dispatch, getState) => {
    let item = floor;
    const buildingID = getState().manageLocation.selectedBuilding.id;
    const { buildings } = getState().manageLocation.facility;

    const building = find(buildings, build => build.id === buildingID);
    if (building && building.floors.length) {
      const newFloor = find(building.floors, fl => fl.id === floor.id);
      if (newFloor) {
        item = newFloor;
      }
    }

    dispatch({
      type: types.SET_SELECTED_FLOOR,
      item
    });
  };
};

export const setSelectedLocation = (
  location: Ilocation,
  facilityID: string
): ThunkResult<void> => {
  return (dispatch, getState) => {
    let item = location;
    const buildingID = getState().manageLocation.selectedBuilding.id;
    const { buildings } = getState().manageLocation.facility;

    const building = find(buildings, build => build.id === buildingID);
    if (building && building.floors.length) {
      const floor = find(building.floors, fl => fl.id === location.floorID);
      if (floor && floor.locations.length) {
        const newLocation = find(
          floor.locations,
          loc => loc.id === location.id
        );
        if (newLocation) {
          item = newLocation;
        }
      }
    }

    dispatch({
      type: types.SET_SELECTED_LOCATION,
      item
    });
  };
};
export const setSelectedRoom = (item?: Iroom) => ({
  type: types.SET_SELECTED_ROOM,
  item
});

export const toggleEditLocationModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_LOCATION
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_LOCATION,
  filters
});
