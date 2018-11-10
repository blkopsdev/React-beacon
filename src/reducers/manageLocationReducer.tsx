// import { pickBy, map } from 'lodash';

import {
  ImanageLocationReducer,
  Ifacility,
  Ibuilding,
  Ifloor,
  Ilocation,
  Iroom
} from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState, { initialLoc } from './initialState';
import * as types from '../actions/actionTypes';

const blankFacility = {
  id: '',
  name: '',
  customerID: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: ''
};

function locationManageFacility(
  state: Ifacility = blankFacility,
  action: any
): Ifacility {
  switch (action.type) {
    case types.LOCATION_MANAGE_SUCCESS:
      return action.facility;
    // case types.LOCATION_ADD_SUCCESS:
    //   return [...state, action.location];
    // case types.LOCATION_UPDATE_SUCCESS:
    //   return map(state, (location: Ilocation) => {
    //     if (location.id === action.location.id) {
    //       return {
    //         ...pickBy(action.location, (property, key) => property !== null)
    //       } as Ilocation;
    //     } else {
    //       return location;
    //     }
    //   });
    case types.USER_LOGOUT_SUCCESS:
      return blankFacility;
    default:
      return state;
  }
}

function selectedBuildingReducer(state: Ibuilding, action: any): Ibuilding {
  switch (action.type) {
    case types.SET_SELECTED_BUILDING:
      return action.building ? action.building : initialLoc;
    case types.USER_LOGOUT_SUCCESS:
      return initialLoc;
    default:
      return state;
  }
}

function selectedFloorReducer(state: Ifloor, action: any): Ifloor {
  switch (action.type) {
    case types.SET_SELECTED_FLOOR:
      return action.floor ? action.floor : initialLoc;
    case types.USER_LOGOUT_SUCCESS:
      return initialLoc;
    default:
      return state;
  }
}

function selectedLocationReducer(state: Ilocation, action: any): Ilocation {
  switch (action.type) {
    case types.SET_SELECTED_LOCATION:
      return action.location ? action.location : initialLoc;
    case types.USER_LOGOUT_SUCCESS:
      return initialLoc;
    default:
      return state;
  }
}

function selectedRoomReducer(state: Iroom, action: any): Iroom {
  switch (action.type) {
    case types.SET_SELECTED_ROOM:
      return action.room ? action.room : initialLoc;
    case types.USER_LOGOUT_SUCCESS:
      return initialLoc;
    default:
      return state;
  }
}

function locationManageData(state: ImanageLocationReducer, action: any): any[] {
  switch (action.type) {
    case types.LOCATION_MANAGE_SUCCESS:
      return action.facility.buildings || [];
    case types.SET_SELECTED_BUILDING:
      return action.building.floors || [];
    case types.SET_SELECTED_FLOOR:
      return action.floor.locations || [];
    case types.SET_SELECTED_LOCATION:
      return action.location.rooms || [];
    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state.data;
  }
}

function locationManageTotalPages(state: number = 1, action: any): number {
  switch (action.type) {
    case types.LOCATION_MANAGE_TOTAL_PAGES:
      if (action.pages && action.pages > 0) {
        return action.pages;
      }
      return state;
    case types.USER_LOGOUT_SUCCESS:
      return 1;
    default:
      return state;
  }
}

export default function locationManage(
  state: ImanageLocationReducer = initialState.manageLocation,
  action: any
) {
  return {
    data: locationManageData(state, action),
    facility: locationManageFacility(state.facility, action),
    totalPages: locationManageTotalPages(state.totalPages, action),
    selectedBuilding: selectedBuildingReducer(state.selectedBuilding, action),
    selectedFloor: selectedFloorReducer(state.selectedFloor, action),
    selectedLocation: selectedLocationReducer(state.selectedLocation, action),
    selectedRoom: selectedRoomReducer(state.selectedRoom, action),
    showEditLocationModal: modalToggleWithName(
      state.showEditLocationModal,
      action,
      'EDIT_LOCATION'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_LOCATION'
    )
  };
}
