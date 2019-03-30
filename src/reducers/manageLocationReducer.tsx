import { map } from 'lodash';

import {
  ImanageLocationReducer,
  Ibuilding,
  Ifloor,
  Ilocation,
  Iroom,
  Ifacility
} from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import initialState, { initialFacility } from './initialState';
import * as types from '../actions/actionTypes';

function locationManageFacility(
  state: Ifacility = initialFacility,
  action: any
): Ifacility {
  switch (action.type) {
    case types.LOCATION_MANAGE_SUCCESS:
      return action.facility;
    case types.LOCATION_ADD_SUCCESS:
      const locationObject = action.locationObject as
        | Ilocation
        | Ibuilding
        | Ifloor
        | Iroom;

      if ('facilityID' in locationObject && state.buildings) {
        // BUILDING
        return {
          ...state,
          buildings: [...state.buildings, locationObject]
        };
      } else if ('buildingID' in locationObject && state.buildings) {
        // FLOOR
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          if (building.id === locationObject.buildingID) {
            return {
              ...building,
              floors: [...building.floors, locationObject]
            };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      } else if ('floorID' in locationObject && state.buildings) {
        // LOCATION
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          const updatedFloors = map(building.floors, floor => {
            if (floor.id === locationObject.floorID) {
              return {
                ...floor,
                locations: [...floor.locations, locationObject]
              };
            } else {
              return floor;
            }
          });
          return { ...building, floors: updatedFloors };
        });
        return { ...state, buildings: updatedBuildings };
      } else if ('locationID' in locationObject && state.buildings) {
        // ROOM
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          const updatedFloors = map(building.floors, floor => {
            const updatedLocations = map(floor.locations, location => {
              if (location.id === locationObject.locationID) {
                return {
                  ...location,
                  rooms: [...location.rooms, locationObject]
                };
              } else {
                return location;
              }
            });
            return { ...floor, locations: updatedLocations };
          });
          return { ...building, floors: updatedFloors };
        });
        return { ...state, buildings: updatedBuildings };
      }
      return state;

    case types.LOCATION_UPDATE_SUCCESS:
      const locationObjectb = action.locationObject as
        | Ilocation
        | Ibuilding
        | Ifloor
        | Iroom;
      if ('facilityID' in locationObjectb && state.buildings) {
        // BUILDING
        return {
          ...state,
          buildings: map(state.buildings, building => {
            if (building.id === locationObjectb.id) {
              return locationObjectb;
            } else {
              return building;
            }
          })
        };
      } else if ('buildingID' in locationObjectb && state.buildings) {
        // FLOOR
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          if (building.id === locationObjectb.buildingID) {
            return {
              ...building,
              floors: map(building.floors, floor => {
                if (floor.id === locationObjectb.id) {
                  return locationObjectb;
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
      } else if ('floorID' in locationObjectb && state.buildings) {
        // LOCATION
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          const updatedFloors = map(building.floors, floor => {
            if (floor.id === locationObjectb.floorID) {
              return {
                ...floor,
                locations: map(floor.locations, location => {
                  if (location.id === locationObjectb.id) {
                    return locationObjectb;
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
        });
        return { ...state, buildings: updatedBuildings };
      } else if ('locationID' in locationObjectb && state.buildings) {
        // ROOM
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          const updatedFloors = map(building.floors, floor => {
            const updatedLocations = map(floor.locations, location => {
              if (location.id === locationObjectb.locationID) {
                return {
                  ...location,
                  rooms: map(location.rooms, room => {
                    if (room.id === locationObjectb.id) {
                      return locationObjectb;
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
          });
          return { ...building, floors: updatedFloors };
        });
        return { ...state, buildings: updatedBuildings };
      }
      return state;

    case types.LOCATION_DELETE_SUCCESS:
      const locationObjectC = action.locationObject as
        | Ilocation
        | Ibuilding
        | Ifloor
        | Iroom;
      if ('facilityID' in locationObjectC && state.buildings) {
        // BUILDING
        return {
          ...state,
          buildings: [
            ...state.buildings.filter(val => {
              return val.id !== locationObjectC.id;
            })
          ]
        };
      } else if ('buildingID' in locationObjectC && state.buildings) {
        // FLOOR
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          if (building.id === locationObjectC.buildingID) {
            return {
              ...building,
              floors: building.floors.filter(val => {
                return val.id !== locationObjectC.id;
              })
            };
          } else {
            return building;
          }
        });
        return { ...state, buildings: updatedBuildings };
      } else if ('floorID' in locationObjectC && state.buildings) {
        // LOCATION
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          const updatedFloors = map(building.floors, floor => {
            if (floor.id === locationObjectC.floorID) {
              return {
                ...floor,
                locations: floor.locations.filter(val => {
                  return val.id !== locationObjectC.id;
                })
              };
            } else {
              return floor;
            }
          });
          return { ...building, floors: updatedFloors };
        });
        return { ...state, buildings: updatedBuildings };
      } else if ('locationID' in locationObjectC && state.buildings) {
        // ROOM
        const updatedBuildings: Ibuilding[] = map(state.buildings, building => {
          const updatedFloors = map(building.floors, floor => {
            const updatedLocations = map(floor.locations, location => {
              if (location.id === locationObjectC.locationID) {
                return {
                  ...location,
                  rooms: location.rooms.filter(val => {
                    return val.id !== locationObjectC.id;
                  })
                };
              } else {
                return location;
              }
            });
            return { ...floor, locations: updatedLocations };
          });
          return { ...building, floors: updatedFloors };
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
    facility: locationManageFacility(state.facility, action),
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
