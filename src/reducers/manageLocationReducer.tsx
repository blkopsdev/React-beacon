import {
  ImanageLocationReducer,
  Ibuilding,
  Ifloor,
  Ilocation,
  Iroom
} from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName,
  createSelectedIDWithName
} from './commonReducers';
import initialState from './initialState';
import * as types from '../actions/actionTypes';

function visibleLocationsReducer(
  state: Array<Ibuilding | Ifloor | Ilocation | Iroom> = [],
  action: any
): Array<Ibuilding | Ifloor | Ilocation | Iroom> {
  switch (action.type) {
    case types.SET_VISIBLE_LOCATIONS:
      return action.locations || [];
    case types.USER_LOGOUT_SUCCESS:
      return [];
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
    visibleLocations: visibleLocationsReducer(state.visibleLocations, action),
    selectedFacilityID: createSelectedIDWithName(
      state.selectedFacilityID,
      action,
      'FACILITY_MANAGE_LOCATION'
    ),
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
