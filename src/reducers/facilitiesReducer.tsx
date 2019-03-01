import * as types from '../actions/actionTypes';
import { Ifacility } from '../models';
import initialState from './initialState';
import { pickBy, map, filter } from 'lodash';

export default function facilities(
  state: Ifacility[] = initialState.facilities,
  action: any
) {
  switch (action.type) {
    case types.GET_FACILITIES_SUCCESS:
      return map(action.facilities, facility => {
        return pickBy(facility, (property, key) => property !== null);
      }) as Ifacility[];
    case types.FACILITY_UPDATE_SUCCESS:
      const facilitiesFiltered = filter(state, c => c.id !== action.facilityID);
      const updatedFacility = pickBy(
        action.facility,
        (property, key) => property !== null
      );
      return [...facilitiesFiltered, updatedFacility] as Ifacility[];
    case types.USER_LOGOUT_SUCCESS:
      return initialState.facilities;

    default:
      return state;
  }
}
