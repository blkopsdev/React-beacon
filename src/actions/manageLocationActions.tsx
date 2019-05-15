// import * as React from 'react';

import { ThunkAction } from 'redux-thunk';
import { toastr } from 'react-redux-toastr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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
import { constants } from 'src/constants/constants';
import * as types from './actionTypes';
import { filter, find } from 'lodash';
import { Dispatch } from 'react-redux';
const uuidv4 = require('uuid/v4');
import { adalFetch } from 'react-adal';
import { authContext } from './userActions';
import { initialFacility } from 'src/reducers/initialState';

type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

export function getFacility(facilityID: string): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    const axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    const url = `${API.GET.facility.getbyid}/${facilityID}`;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
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
        console.error(error);
      });
  };
}

/*
* save (add) a new building/floor/location/room
* installBaseLocations is defined when saving locations from the editInstallForm
*/
export function saveAnyLocation(
  name: string,
  facilityID: string,
  installBaseLocations?: {
    buildingID?: string;
    floorID?: string;
    locationID?: string;
  }
): ThunkResult<{ id: string }> {
  return (dispatch, getState) => {
    let {
      buildingID,
      floorID,
      locationID
    } = getState().manageLocation.tableFilters;
    if (installBaseLocations) {
      buildingID = installBaseLocations.buildingID;
      floorID = installBaseLocations.floorID;
      locationID = installBaseLocations.locationID;
    }
    const newLocationObject = {
      id: uuidv4(),
      name,
      isDeleted: false
    };
    if (locationID) {
      saveAnyLocationObjectHelper(
        dispatch,
        getState,
        { ...newLocationObject, locationID },
        facilityID
      );
    } else if (floorID) {
      saveAnyLocationObjectHelper(
        dispatch,
        getState,
        { ...newLocationObject, floorID, rooms: [] },
        facilityID
      );
    } else if (buildingID) {
      saveAnyLocationObjectHelper(
        dispatch,
        getState,
        { ...newLocationObject, buildingID, locations: [] },
        facilityID
      );
    } else {
      saveAnyLocationObjectHelper(
        dispatch,
        getState,
        { ...newLocationObject, facilityID, floors: [] },
        facilityID
      );
    }
    return newLocationObject;
  };
}
const saveAnyLocationObjectHelper = (
  dispatch: Dispatch,
  getState: () => IinitialState,
  locationObject: Ilocation | Ibuilding | Ifloor | Iroom,
  facilityID: string
) => {
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
  const axiosOptions: AxiosRequestConfig = {
    method: 'post',
    data: locationObject
  };
  const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
  return adalFetch(authContext, resource, axios, url, axiosOptions)
    .then((data: AxiosResponse<any>) => {
      if (!data.data) {
        throw undefined;
      } else {
        dispatch({
          type: types.LOCATION_ADD_SUCCESS,
          lType,
          locationObject,
          facilityID
        });
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

/*
* update (edit) a building/floor/location/room
*/
export function updateAnyLocation(
  locationObject: Ilocation | Ibuilding | Ifloor | Iroom,
  facilityID: string
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
    const axiosOptions: AxiosRequestConfig = {
      method: 'put',
      data: locationObject
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.LOCATION_UPDATE_SUCCESS,
            lType,
            locationObject,
            facilityID
          });

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
  locationObject: Ilocation | Ibuilding | Ifloor | Iroom,
  facilityID: string
): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(beginAjaxCall());
    let url: string;
    let lType: string;
    if ('facilityID' in locationObject) {
      url = `${API.DELETE.building}/${locationObject.id}`;
      lType = 'Building';
    } else if ('buildingID' in locationObject) {
      url = `${API.DELETE.floor}/${locationObject.id}`;
      lType = 'Floor';
    } else if ('floorID' in locationObject) {
      url = `${API.DELETE.location}/${locationObject.id}`;
      lType = 'Location';
    } else {
      url = `${API.DELETE.room}/${locationObject.id}`;
      lType = 'Room';
    }
    const axiosOptions: AxiosRequestConfig = {
      method: 'delete'
    };
    const resource = `${process.env.REACT_APP_ADAL_CLIENTID}`;
    return adalFetch(authContext, resource, axios, url, axiosOptions)
      .then((data: AxiosResponse<any>) => {
        if (data.status !== 200) {
          throw undefined;
        } else {
          dispatch({
            type: types.LOCATION_DELETE_SUCCESS,
            lType,
            locationObject,
            facilityID
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

export const filterLocations = (facilityID: string): ThunkResult<void> => {
  return (dispatch, getState) => {
    const { tableFilters } = getState().manageLocation;
    const { buildingID, locationID, floorID } = tableFilters;
    const { buildings } = getState().facilities[facilityID] || initialFacility;
    let locations: Array<Ibuilding | Ifloor | Ilocation | Iroom> = [];
    if (buildingID && floorID && locationID) {
      // LOCATION
      const building: Ibuilding | undefined = find(
        buildings,
        build => build.id === buildingID
      );
      if (building && building.floors.length) {
        const newFloor = find(building.floors, fl => fl.id === floorID);
        if (newFloor && newFloor.locations.length) {
          const location = newFloor.locations.find(
            item => item.id === locationID
          );
          if (location && location.rooms.length) {
            locations = filterLocationsHelper(location.rooms, tableFilters);
          }
        }
      }
    } else if (buildingID && floorID) {
      const building = find(buildings, build => build.id === buildingID);
      if (building && building.floors.length) {
        const newFloor = find(building.floors, fl => fl.id === floorID);
        if (newFloor && newFloor.locations.length) {
          locations = filterLocationsHelper(newFloor.locations, tableFilters);
        }
      }
    } else if (buildingID) {
      const building = find(buildings, build => build.id === buildingID);
      if (building && building.floors.length) {
        locations = filterLocationsHelper(building.floors, tableFilters);
      }
    } else {
      locations = filterLocationsHelper(buildings, tableFilters);
    }

    dispatch({
      type: types.SET_VISIBLE_LOCATIONS,
      locations
    });
  };
};
/*
* receive an array of locationObjects and filter out based on the selected filters and deleted items
*/
const filterLocationsHelper = (
  locations: Array<Ibuilding | Ifloor | Ilocation | Iroom>,
  tableFilters: ItableFiltersParams
) => {
  // const {} = tableFilters;
  return filter(locations, location => {
    let shouldInclude = true;
    if (location.isDeleted === true) {
      shouldInclude = false;
    }
    return shouldInclude;
  });
};

// export const setSelectedFacility = (facility: Ifacility) => ({
//   type: types.SET_SELECTED_FACILITY,
//   facility
// });

export const toggleEditLocationModal = () => ({
  type: types.TOGGLE_MODAL_EDIT_LOCATION
});

export const setTableFilter = (filters: ItableFiltersParams) => ({
  type: types.SET_TABLE_FILTER_MANAGE_LOCATION,
  filters
});
