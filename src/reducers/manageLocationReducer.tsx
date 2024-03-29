import { map } from 'lodash';

import {
  ImanageLocationReducer,
  Ibuilding,
  Ifloor,
  Ilocation,
  Iroom,
  IfacilityComplete
} from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState, {
  initialBuilding,
  initialFacility,
  initialFloor,
  initialLoc,
  initialRoom
} from './initialState';
import * as types from '../actions/actionTypes';

function locationManageFacility(
  state: IfacilityComplete = initialFacility,
  action: any
): IfacilityComplete {
  switch (action.type) {
    case types.LOCATION_MANAGE_SUCCESS:
      return action.facility;
    case types.LOCATION_ADD_SUCCESS:
      if (action.lType === 'Building' && state.buildings) {
        return {
          ...state,
          buildings: [...state.buildings, action.item]
        };
      } else if (action.lType === 'Floor' && state.buildings) {
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            return { ...building, floors: [...building.floors, action.item] };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      } else if (action.lType === 'Location' && state.buildings) {
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            const updatedFloors = map(building.floors, floor => {
              if (floor.id === action.item.floorID) {
                return {
                  ...floor,
                  locations: [...floor.locations, action.item]
                };
              } else {
                return floor;
              }
            });
            return { ...building, floors: updatedFloors };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      } else if (action.lType === 'Room' && state.buildings) {
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            const updatedFloors = map(building.floors, floor => {
              if (floor.id === action.item.floorID) {
                const updatedLocations = map(floor.locations, location => {
                  if (location.id === action.item.locationID) {
                    return {
                      ...location,
                      rooms: [...location.rooms, action.item]
                    };
                  } else {
                    return location;
                  }
                });
                return { ...floor, locations: updatedLocations };
              } else {
                return floor;
              }
            });
            return { ...building, floors: updatedFloors };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      }
      return state;

    case types.LOCATION_UPDATE_SUCCESS:
      if (action.lType === 'Building' && state.buildings) {
        return {
          ...state,
          buildings: map(state.buildings, building => {
            if (building.id === action.item.id) {
              return action.item;
            } else {
              return building;
            }
          })
        };
      } else if (action.lType === 'Floor' && state.buildings) {
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            return {
              ...building,
              floors: map(building.floors, floor => {
                if (floor.id === action.item.id) {
                  return action.item.id;
                } else {
                  return floor;
                }
              })
            };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      } else if (action.lType === 'Location' && state.buildings) {
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            const updatedFloors = map(building.floors, floor => {
              if (floor.id === action.item.floorID) {
                return {
                  ...floor,
                  locations: map(floor.locations, location => {
                    if (location.id === action.item.id) {
                      return action.item;
                    } else {
                      return location;
                    }
                  })
                };
              } else {
                return floor;
              }
            });
            return { ...building, floors: updatedFloors };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      } else if (action.lType === 'Room' && state.buildings) {
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            const updatedFloors = map(building.floors, floor => {
              if (floor.id === action.item.floorID) {
                const updatedLocations = map(floor.locations, location => {
                  if (location.id === action.item.locationID) {
                    return {
                      ...location,
                      rooms: map(location.rooms, room => {
                        if (room.id === action.item.id) {
                          return action.item;
                        } else {
                          return room;
                        }
                      })
                    };
                  } else {
                    return location;
                  }
                });
                return { ...floor, locations: updatedLocations };
              } else {
                return floor;
              }
            });
            return { ...building, floors: updatedFloors };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      }
      return state;

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
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            return {
              ...building,
              floors: building.floors.filter(val => {
                return val.id !== action.item.id;
              })
            };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      } else if (action.lType === 'Location' && state.buildings) {
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            const updatedFloors = map(building.floors, floor => {
              if (floor.id === action.item.floorID) {
                return {
                  ...floor,
                  locations: floor.locations.filter(val => {
                    return val.id !== action.item.id;
                  })
                };
              } else {
                return floor;
              }
            });
            return { ...building, floors: updatedFloors };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      } else if (action.lType === 'Room' && state.buildings) {
        const updatedBuildings = map(state.buildings, building => {
          if (building.id === action.item.buildingID) {
            const updatedFloors = map(building.floors, floor => {
              if (floor.id === action.item.floorID) {
                const updatedLocations = map(floor.locations, location => {
                  if (location.id === action.item.locationID) {
                    return {
                      ...location,
                      rooms: location.rooms.filter(val => {
                        return val.id !== action.item.id;
                      })
                    };
                  } else {
                    return location;
                  }
                });
                return { ...floor, locations: updatedLocations };
              } else {
                return floor;
              }
            });
            return { ...building, floors: updatedFloors };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      }
      return state;

    case types.USER_LOGOUT_SUCCESS:
      return initialFacility;
    default:
      return state;
  }
}

function selectedBuildingReducer(
  state: Ibuilding = initialBuilding,
  action: any
): Ibuilding {
  switch (action.type) {
    case types.SET_SELECTED_BUILDING:
      return action.item ? action.item : initialBuilding;
    case types.USER_LOGOUT_SUCCESS:
      return initialBuilding;
    default:
      return state;
  }
}

function selectedFloorReducer(
  state: Ifloor = initialFloor,
  action: any
): Ifloor {
  switch (action.type) {
    case types.SET_SELECTED_FLOOR:
      return action.item ? action.item : initialFloor;
    case types.SET_SELECTED_BUILDING:
      return initialFloor;
    case types.USER_LOGOUT_SUCCESS:
      return initialFloor;
    default:
      return state;
  }
}

function selectedLocationReducer(
  state: Ilocation = initialLoc,
  action: any
): Ilocation {
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

function selectedRoomReducer(state: Iroom = initialRoom, action: any): Iroom {
  switch (action.type) {
    case types.SET_SELECTED_ROOM:
      return action.item ? action.item : initialRoom;
    case types.SET_SELECTED_BUILDING:
      return initialRoom;
    case types.SET_SELECTED_FLOOR:
      return initialRoom;
    case types.SET_SELECTED_LOCATION:
      return initialRoom;
    case types.USER_LOGOUT_SUCCESS:
      return initialRoom;
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
