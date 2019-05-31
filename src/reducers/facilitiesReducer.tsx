import { pickBy, map, keyBy } from 'lodash';

import {
  Ifacility,
  Ilocation,
  Ibuilding,
  Ifloor,
  Iroom,
  IfacilityWithoutBuildings
} from '../models';
import * as types from '../actions/actionTypes';
import initialState, { initialFacility } from './initialState';

export default function facilitiesReducer(
  state: { [key: string]: Ifacility } = initialState.facilities,
  action: any
): { [key: string]: Ifacility } {
  switch (action.type) {
    case types.GET_FACILITIES_SUCCESS:
      const newFacilities = map(action.facilities, facility => {
        return {
          ...initialFacility,
          ...pickBy(facility, (property, key) => property !== null)
        };
      }) as Ifacility[];
      return { ...state, ...keyBy(newFacilities, 'id') };
    case types.GET_CUSTOMERS_AND_FACILITY_SUCCESS:
      /*
      loop over the customers and update the facilities in state
      */
      let newFacilitiesWithoutBuildings: IfacilityWithoutBuildings[] = [];
      action.payload.forEach(
        (customer: { facilities: IfacilityWithoutBuildings[] }) => {
          customer.facilities.forEach(facility => {
            newFacilitiesWithoutBuildings = [
              ...newFacilitiesWithoutBuildings,
              cleanFacilityWithoutBuildings(facility)
            ];
          });
        }
      );
      // add the buildings from state or an empty array
      const newFacilitiesByID = keyBy(
        map(newFacilitiesWithoutBuildings, newFacility => ({
          ...newFacility,
          buildings: state[newFacility.id]
            ? state[newFacility.id].buildings
            : []
        })),
        'id'
      );
      return { ...state, ...newFacilitiesByID };

    case types.FACILITY_UPDATE_SUCCESS:
      return {
        ...state,
        [action.facility.id]: {
          ...state[action.facility.id],
          ...action.facility
        }
      }; // TODO only update specific attributes
    case types.LOCATION_MANAGE_SUCCESS:
      return { ...state, [action.facility.id]: action.facility };

    case types.LOCATION_ADD_SUCCESS:
      const locationObject = action.locationObject as
        | Ilocation
        | Ibuilding
        | Ifloor
        | Iroom;
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

        This structure is the source of truth that sets the inital
        content of the visible array.
      */
      const facilityID = action.facilityID;
      const originalFacility = state[facilityID] as Ifacility;

      if ('facilityID' in locationObject && originalFacility.buildings) {
        // BUILDING
        return {
          ...state,
          [facilityID]: {
            ...originalFacility,
            buildings: [...originalFacility.buildings, locationObject]
          }
        };
      } else if ('buildingID' in locationObject && originalFacility.buildings) {
        // FLOOR
        const updatedBuildings: Ibuilding[] = map(
          originalFacility.buildings,
          building => {
            if (building.id === locationObject.buildingID) {
              return {
                ...building,
                floors: [...building.floors, locationObject]
              };
            } else {
              return building;
            }
          }
        );
        return {
          ...state,
          [facilityID]: { ...originalFacility, buildings: updatedBuildings }
        };
      } else if ('floorID' in locationObject && originalFacility.buildings) {
        // LOCATION
        const updatedBuildings: Ibuilding[] = map(
          originalFacility.buildings,
          building => {
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
          }
        );
        return {
          ...state,
          [facilityID]: { ...originalFacility, buildings: updatedBuildings }
        };
      } else if ('locationID' in locationObject && originalFacility.buildings) {
        // ROOM
        const updatedBuildings: Ibuilding[] = map(
          originalFacility.buildings,
          building => {
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
          }
        );
        return {
          ...state,
          [facilityID]: { ...originalFacility, buildings: updatedBuildings }
        };
      }
      return state;

    case types.LOCATION_UPDATE_SUCCESS:
      const facilityIDb = action.facilityID;
      const originalFacilityb = state[facilityIDb] as Ifacility;
      const locationObjectb = action.locationObject as
        | Ilocation
        | Ibuilding
        | Ifloor
        | Iroom;

      if ('facilityID' in locationObjectb && originalFacilityb.buildings) {
        // BUILDING
        return {
          ...state,
          [facilityIDb]: {
            ...originalFacilityb,
            buildings: map(originalFacilityb.buildings, building => {
              if (building.id === locationObjectb.id) {
                return locationObjectb;
              } else {
                return building;
              }
            })
          }
        };
      } else if (
        'buildingID' in locationObjectb &&
        originalFacilityb.buildings
      ) {
        // FLOOR
        const updatedBuildings: Ibuilding[] = map(
          originalFacilityb.buildings,
          building => {
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
          }
        );
        return {
          ...state,
          [facilityIDb]: { ...originalFacilityb, buildings: updatedBuildings }
        };
      } else if ('floorID' in locationObjectb && originalFacilityb.buildings) {
        // LOCATION
        const updatedBuildings: Ibuilding[] = map(
          originalFacilityb.buildings,
          building => {
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
          }
        );
        return {
          ...state,
          [facilityIDb]: { ...originalFacilityb, buildings: updatedBuildings }
        };
      } else if (
        'locationID' in locationObjectb &&
        originalFacilityb.buildings
      ) {
        // ROOM
        const updatedBuildings: Ibuilding[] = map(
          originalFacilityb.buildings,
          building => {
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
          }
        );
        return {
          ...state,
          [facilityIDb]: { ...originalFacilityb, buildings: updatedBuildings }
        };
      }
      return state;

    case types.LOCATION_DELETE_SUCCESS:
      const facilityIDc = action.facilityID;
      const originalFacilityc = state[facilityIDc] as Ifacility;
      const locationObjectC = action.locationObject as
        | Ilocation
        | Ibuilding
        | Ifloor
        | Iroom;

      if ('facilityID' in locationObjectC && originalFacilityc.buildings) {
        // BUILDING
        return {
          ...state,
          [facilityIDc]: {
            ...originalFacilityc,
            buildings: originalFacilityc.buildings.map(building => {
              if (building.id === locationObjectC.id) {
                return { ...building, isDeleted: true };
              } else {
                return building;
              }
            })
          }
        };
      } else if (
        'buildingID' in locationObjectC &&
        originalFacilityc.buildings
      ) {
        // FLOOR
        const updatedBuildings: Ibuilding[] = map(
          originalFacilityc.buildings,
          building => {
            if (building.id === locationObjectC.buildingID) {
              return {
                ...building,
                floors: building.floors.map(floor => {
                  if (floor.id === locationObjectC.id) {
                    return { ...floor, isDeleted: true };
                  } else {
                    return floor;
                  }
                })
              };
            } else {
              return building;
            }
          }
        );
        return {
          ...state,
          [facilityIDc]: { ...originalFacilityc, buildings: updatedBuildings }
        };
      } else if ('floorID' in locationObjectC && originalFacilityc.buildings) {
        // LOCATION
        const updatedBuildings: Ibuilding[] = map(
          originalFacilityc.buildings,
          building => {
            const updatedFloors = map(building.floors, floor => {
              if (floor.id === locationObjectC.floorID) {
                return {
                  ...floor,
                  locations: floor.locations.map(location => {
                    if (location.id === locationObjectC.id) {
                      return { ...location, isDeleted: true };
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
          }
        );
        return {
          ...state,
          [facilityIDc]: { ...originalFacilityc, buildings: updatedBuildings }
        };
      } else if (
        'locationID' in locationObjectC &&
        originalFacilityc.buildings
      ) {
        // ROOM
        const updatedBuildings: Ibuilding[] = map(
          originalFacilityc.buildings,
          building => {
            const updatedFloors = map(building.floors, floor => {
              const updatedLocations = map(floor.locations, location => {
                if (location.id === locationObjectC.locationID) {
                  return {
                    ...location,
                    rooms: location.rooms.map(room => {
                      if (room.id === locationObjectC.id) {
                        return { ...room, isDeleted: true };
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
          }
        );
        return {
          ...state,
          [facilityIDc]: { ...originalFacilityc, buildings: updatedBuildings }
        };
      }
      return state;

    case types.USER_LOGOUT_SUCCESS:
      return initialState.facilities;

    default:
      return state;
  }
}

const cleanFacilityWithoutBuildings = (facility: IfacilityWithoutBuildings) => {
  const { buildings, ...initialFacilityWithoutBuildings } = initialFacility;

  return {
    ...initialFacilityWithoutBuildings,
    ...pickBy(facility, (property, key) => property !== null)
  };
};

export const cleanFacility = (facility: Ifacility = initialFacility) => {
  let buildings = facility.buildings;

  if (buildings && buildings.length) {
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
  return {
    ...initialFacility,
    ...pickBy(facility, (property, key) => property !== null),
    buildings
  };
};
