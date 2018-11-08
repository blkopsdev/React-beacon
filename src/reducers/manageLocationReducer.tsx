// import { pickBy, map } from 'lodash';

import { ImanageLocationReducer, Ifacility } from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';

// function locationManageData(state: Ilocation[] = [], action: any): Ilocation[] {
//   switch (action.type) {
//     case types.LOCATION_MANAGE_SUCCESS:
//       return action.locations;
//     case types.LOCATION_ADD_SUCCESS:
//       return [...state, action.location];
//     case types.LOCATION_UPDATE_SUCCESS:
//       return map(state, (location: Ilocation) => {
//         if (location.id === action.location.id) {
//           return {
//             ...pickBy(action.location, (property, key) => property !== null)
//           } as Ilocation;
//         } else {
//           return location;
//         }
//       });
//     case types.USER_LOGOUT_SUCCESS:
//       return [];
//     default:
//       return state;
//   }
// }

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

function locationManageData(
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
    data: state.data,
    facility: locationManageData(state.facility, action),
    totalPages: locationManageTotalPages(state.totalPages, action),
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
