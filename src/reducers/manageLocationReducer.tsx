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
      /* 
        This looks scary, but its fairly straightforward.
        We are dealing with a tree data structure something like this:
        buildings: [
          building1: {
            floors: [
              floor1: {
                locations: [
                  location1: {
                    rooms: [
                      room1: {},
                      ...
                    ]
                  },
                  ...
                ]
              },
              ...
            ]
          },
          ...
        ]

        The main reason to update this piece of state is for when the user switches the type 
        of location that is visible. This structure is the source of truth that sets the inital
        content of the visible array. Further comments are found under the if (action.lType === "Room"..)
      */
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
      } else if (action.lType === 'Location' && state.buildings) {
        let b = find(state.buildings, val => val.id === action.item.buildingID);
        if (!b) {
          b = initialLoc;
        }
        let f = find(b.floors, val => val.id === action.item.floorID);
        if (!f) {
          f = initialLoc;
        }
        f.locations = f.locations ? [...f.locations, action.item] : [];
        b.floors = b.floors
          ? [
              ...b.floors.filter(val => {
                return f && val.id !== f.id;
              }),
              f
            ]
          : [];
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => val.id !== action.item.buildingID),
            b
          ]
        };
      } else if (action.lType === 'Room' && state.buildings) {
      /* 
        The if blocks above are just simpler versions of this one. 
      */
        // We are passing in the entire path of parent ids on the created/updated item
        // First, we use buildingID to locate the correct building
        let b = find(state.buildings, val => val.id === action.item.buildingID);
        // This never happens, but it makes typescript happy since its *possible* the building could be undefined
        if (!b) {
          b = initialLoc;
        }
        // Now we go a step deeper into the tree, locating the correct floor within the building
        let f = find(b.floors, val => val.id === action.item.floorID);
        if (!f) {
          f = initialLoc;
        }
        // Yet deeper, locating the correct location within the floor
        let l = find(f.locations, val => val.id === action.item.locationID);
        if (!l) {
          l = initialLoc;
        }
        // Now we add the room to the array of rooms in this location
        // (In the LOCATION_UPDATE variation, we find the existing room and replace it)
        l.rooms = l.rooms ? [...l.rooms, action.item] : [];
        // now that we've found and modified our data, we recontruct our tree in reverse
        // starting with setting the new location with it's updated array of rooms
        // back to the given floor.
        f.locations = f.locations
          ? [
              ...f.locations.filter(val => {
                return l && val.id !== l.id;
              }),
              l
            ]
          : [];
        // then we put the floor back into the correct building
        b.floors = b.floors
          ? [
              ...b.floors.filter(val => {
                return f && val.id !== f.id;
              }),
              f
            ]
          : [];
        // finally we set the replace the correct building in the array of buildings
        // and return
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => val.id !== action.item.buildingID),
            b
          ]
        };
      }
      return state;
    // see LOCATION_ADD_SUCCESS for comments on how this works
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
      } else if (action.lType === 'Location' && state.buildings) {
        let b = find(state.buildings, val => val.id === action.item.buildingID);
        if (!b) {
          b = initialLoc;
        }
        let f = find(b.floors, val => val.id === action.item.floorID);
        if (!f) {
          f = initialLoc;
        }
        f.locations = f.locations
          ? [
              ...f.locations.filter(val => {
                return val.id !== action.item.id;
              }),
              action.item
            ]
          : [];
        b.floors = b.floors
          ? [
              ...b.floors.filter(val => {
                return f && val.id !== f.id;
              }),
              f
            ]
          : [];
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => val.id !== action.item.buildingID),
            b
          ]
        };
      } else if (action.lType === 'Room' && state.buildings) {
        let b = find(state.buildings, val => val.id === action.item.buildingID);
        if (!b) {
          b = initialLoc;
        }
        let f = find(b.floors, val => val.id === action.item.floorID);
        if (!f) {
          f = initialLoc;
        }
        let l = find(f.locations, val => val.id === action.item.locationID);
        if (!l) {
          l = initialLoc;
        }
        l.rooms = l.rooms
          ? [
              ...l.rooms.filter(val => {
                return val.id !== action.item.id;
              }),
              action.item
            ]
          : [];
        f.locations = f.locations
          ? [
              ...f.locations.filter(val => {
                return l && val.id !== l.id;
              }),
              l
            ]
          : [];
        b.floors = b.floors
          ? [
              ...b.floors.filter(val => {
                return f && val.id !== f.id;
              }),
              f
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
    // see LOCATION_ADD_SUCCESS for comments on how this works
    case types.LOCATION_DELETE_SUCCESS:
      if (action.lType === 'Building' && state.buildings) {
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => {
              return val.id !== action.item.id;
            })
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
              })
            ]
          : [];
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => val.id !== action.item.buildingID),
            b
          ]
        };
      } else if (action.lType === 'Location' && state.buildings) {
        let b = find(state.buildings, val => val.id === action.item.buildingID);
        if (!b) {
          b = initialLoc;
        }
        let f = find(b.floors, val => val.id === action.item.floorID);
        if (!f) {
          f = initialLoc;
        }
        f.locations = f.locations
          ? [
              ...f.locations.filter(val => {
                return val.id !== action.item.id;
              })
            ]
          : [];
        b.floors = b.floors
          ? [
              ...b.floors.filter(val => {
                return f && val.id !== f.id;
              }),
              f
            ]
          : [];
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => val.id !== action.item.buildingID),
            b
          ]
        };
      } else if (action.lType === 'Room' && state.buildings) {
        let b = find(state.buildings, val => val.id === action.item.buildingID);
        if (!b) {
          b = initialLoc;
        }
        let f = find(b.floors, val => val.id === action.item.floorID);
        if (!f) {
          f = initialLoc;
        }
        let l = find(f.locations, val => val.id === action.item.locationID);
        if (!l) {
          l = initialLoc;
        }
        l.rooms = l.rooms
          ? [
              ...l.rooms.filter(val => {
                return val.id !== action.item.id;
              })
            ]
          : [];
        f.locations = f.locations
          ? [
              ...f.locations.filter(val => {
                return l && val.id !== l.id;
              }),
              l
            ]
          : [];
        b.floors = b.floors
          ? [
              ...b.floors.filter(val => {
                return f && val.id !== f.id;
              }),
              f
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

// This reducer manages the array of currently visible locations in the table
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
    case types.LOCATION_DELETE_SUCCESS:
      return [
        ...state.data.filter(val => {
          return val.id !== action.item.id;
        })
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
