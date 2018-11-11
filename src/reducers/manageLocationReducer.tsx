import { find } from 'lodash';

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
    case types.LOCATION_ADD_SUCCESS:
      if (action.lType === 'Building' && state.buildings) {
        return { ...state, buildings: [...state.buildings, action.item] };
      } else if (action.lType === 'Floor' && state.buildings) {
        let b = find(state.buildings, val => val.id === action.item.buildingID);
        if (!b) {
          b = initialLoc;
        }
        b.floors = b.floors ? [...b.floors, action.item] : [];
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => val.id !== action.item.buildingID),
            b
          ]
        };
      }
      // else if (action.lType === "Location" && state.buildings) {
      //   let b = find(state.buildings, val => val.id === action.item.buildingID);
      //   if (!b) {
      //     b = initialLoc;
      //   }
      //   b.floors = b.floors ? [...b.floors, action.item] : [];
      //   return {...state, buildings: [...state.buildings.filter((val) => val.id !== action.item.buildingID), b]};
      // }
      return state;
    case types.LOCATION_UPDATE_SUCCESS:
      if (action.lType === 'Building' && state.buildings) {
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => {
              return val.id !== action.item.id;
            }),
            action.item
          ]
        };
      } else if (action.lType === 'Floor' && state.buildings) {
        let b = find(state.buildings, val => val.id === action.item.buildingID);
        if (!b) {
          b = initialLoc;
        }
        b.floors = b.floors
          ? [
              ...b.floors.filter(val => {
                return val.id !== action.item.id;
              }),
              action.item
            ]
          : [];
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => val.id !== action.item.buildingID),
            b
          ]
        };
      }
      return state;
    case types.USER_LOGOUT_SUCCESS:
      return blankFacility;
    default:
      return state;
  }
}

function selectedBuildingReducer(state: Ibuilding, action: any): Ibuilding {
  switch (action.type) {
    case types.SET_SELECTED_BUILDING:
      return action.item ? action.item : initialLoc;
    case types.USER_LOGOUT_SUCCESS:
      return initialLoc;
    default:
      return state;
  }
}

function selectedFloorReducer(state: Ifloor, action: any): Ifloor {
  console.log('GOT HERE', action.type);
  switch (action.type) {
    case types.SET_SELECTED_FLOOR:
      return action.item ? action.item : initialLoc;
    case types.SET_SELECTED_BUILDING:
      return initialLoc;
    case types.USER_LOGOUT_SUCCESS:
      return initialLoc;
    default:
      return state;
  }
}

function selectedLocationReducer(state: Ilocation, action: any): Ilocation {
  switch (action.type) {
    case types.SET_SELECTED_LOCATION:
      return action.item ? action.item : initialLoc;
    case types.SET_SELECTED_BUILDING:
      return initialLoc;
    case types.SET_SELECTED_FLOOR:
      return initialLoc;
    case types.USER_LOGOUT_SUCCESS:
      return initialLoc;
    default:
      return state;
  }
}

function selectedRoomReducer(state: Iroom, action: any): Iroom {
  switch (action.type) {
    case types.SET_SELECTED_ROOM:
      return action.item ? action.item : initialLoc;
    case types.SET_SELECTED_BUILDING:
      return initialLoc;
    case types.SET_SELECTED_FLOOR:
      return initialLoc;
    case types.SET_SELECTED_LOCATION:
      return initialLoc;
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
    case types.LOCATION_ADD_SUCCESS:
      return [...state.data, action.item];
    case types.LOCATION_UPDATE_SUCCESS:
      return [
        ...state.data.filter(val => {
          return val.id !== action.item.id;
        }),
        action.item
      ];
    case types.SET_SELECTED_BUILDING:
      if (!action.item.id) {
        return (state.facility && state.facility.buildings) || [];
      }
      return action.item.floors || [];
    case types.SET_SELECTED_FLOOR:
      return action.item.locations || [];
    case types.SET_SELECTED_LOCATION:
      return action.item.rooms || [];
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
