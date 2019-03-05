import { map, find } from 'lodash';
import { TranslationFunction } from 'react-i18next';
import { Column } from 'react-table';
import { IinstallBase, Ifacility } from 'src/models';

export const TableUtil = {
  translateHeaders: (columns: Column[], t: TranslationFunction) => {
    return map(columns, column => {
      if (column.Header && typeof column.Header === 'string') {
        return { ...column, Header: t(column.Header) };
      }
      return column;
    });
  },
  /*
* take the install and find the names for the location id's.  building, floor, locations, rooms, position
*/
  buildLocation: (install: IinstallBase, facility: Ifacility) => {
    let locationString = '';
    const building = find(facility.buildings, {
      id: install.buildingID
    });

    if (building) {
      locationString += building.name;
      const floor = find(building.floors, { id: install.floorID });
      if (floor) {
        locationString += `: ${floor.name}`;
        const location = find(floor.locations, { id: install.locationID });
        if (location) {
          locationString += `: ${location.name}`;
          const room = find(location.rooms, { id: install.roomID });
          if (room) {
            locationString += `: ${room.name}`;
          }
        }
      }
    }
    if (install.position) {
      locationString += `: ${install.position}`;
    }
    return locationString;
  }
};
