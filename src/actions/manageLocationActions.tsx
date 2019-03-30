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
  Iroom,
  Ifacility
} from '../models';
import { beginAjaxCall } from './ajaxStatusActions';
import API from '../constants/apiEndpoints';
import { constants } from 'src/constants/constants';
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
            facility: cleanFacility(data.data)
          });
        }
      })
      .catch((error: any) => {
        dispatch({ type: types.LOCATION_MANAGE_FAILED });
        constants.handleError(error, 'get facility locations');
        console.error(error);
      });
  };
}

/*
* save (add) a new building/floor/location/room
*/
export function saveAnyLocation(
  locationObject: Ilocation | Ibuilding | Ifloor | Iroom,
  facilityID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    let url: string;
    let lType: string;
    if ('facilityID' in locationObject) {
      url = API.POST.building;
      lType = 'Building';
    } else if ('buildingID' in locationObject) {
      url = API.POST.floor;
      lType = 'Floor';
    } else if ('floorID' in locationObject) {
      url = API.POST.location;
      lType = 'Location';
    } else {
      url = API.POST.room;
      lType = 'Room';
    }
    return axios
      .post(url, locationObject)
      .then(data => {
        if (!data.data) {
          throw undefined;
        } else {
          dispatch({
            type: types.LOCATION_ADD_SUCCESS,
            lType,
            locationObject
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
        console.error(error);
      });
  };
}

/*
* update (edit) a building/floor/location/room
*/
export function updateAnyLocation(
  locationObject: Ilocation | Ibuilding | Ifloor | Iroom
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    let url: string;
    let lType: string;
    if ('facilityID' in locationObject) {
      url = `${API.PUT.building}/${locationObject.id}`;
      lType = 'Building';
    } else if ('buildingID' in locationObject) {
      url = `${API.PUT.floor}/${locationObject.id}`;
      lType = 'Floor';
    } else if ('floorID' in locationObject) {
      url = `${API.PUT.location}/${locationObject.id}`;
      lType = 'Location';
    } else {
      url = `${API.PUT.room}/${locationObject.id}`;
      lType = 'Room';
    }
    return axios
      .put(url, locationObject)
      .then(data => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.LOCATION_UPDATE_SUCCESS,
            lType,
            locationObject
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
        console.error(error);
      });
  };
}

/*
* update (edit) a building/floor/location/room
*/
export function deleteAnyLocation(
  item: Ilocation | Ibuilding | Ifloor | Iroom,
  lType: 'Building' | 'Floor' | 'Location' | 'Room'
): ThunkResult<void> {
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
        console.error(error);
      });
  };
}

export const setSelectedFacility = (facility: Ifacility) => ({
  type: types.SET_SELECTED_FACILITY,
  facility
});

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

const cleanFacility = (facility: Ifacility) => {
  let buildings = facility.buildings;

  if (buildings.length) {
    buildings = buildings.filter(building => building.isDeleted === false);
    if (buildings.length) {
      buildings = buildings.map(building => {
        const filteredFloors = building.floors.filter(
          floor => floor.isDeleted === false
        );
        if (filteredFloors.length) {
          const floors = filteredFloors.map(floor => {
            const filteredLocations = floor.locations.filter(
              location => location.isDeleted === false
            );
            if (filteredLocations.length) {
              const locations = filteredLocations.map(location => {
                if (location.rooms.length) {
                  return {
                    ...location,
                    rooms: location.rooms.filter(
                      room => room.isDeleted === false
                    )
                  };
                } else {
                  return location;
                }
              });
              return { ...floor, locations };
            } else {
              return { ...floor, locations: filteredLocations };
            }
          });
          return { ...building, floors };
        } else {
          return { ...building, floors: filteredFloors };
        }
      });
    }
  }
  return { ...facility, buildings };
};
