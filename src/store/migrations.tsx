import { MigrationManifest } from 'redux-persist';
import { IinitialState } from 'src/models';
import initialState from 'src/reducers/initialState';

/*
* Migration 1 runs when upgrading from 0 to 1
* 0.0.1 = 1  and 0.2.2 = 22
*/
export const migrations = {
  0: state => {
    const prevState = state as IinitialState;
    return {
      ...state,
      user: prevState.user
    };
  },
  1: state => {
    const prevState = state as IinitialState;
    console.log('Running Migration 1');
    return {
      ...state,
      user: { ...prevState.user, updatedVersionWhohoo: true }
    };
  },
  7: state => {
    const prevState = state as IinitialState;
    return {
      ...prevState,
      manageMeasurementPointLists: initialState.manageMeasurementPointLists
    };
  },
  8: state => {
    const prevState = state as IinitialState;
    return {
      ...prevState,
      manageMeasurementPointLists: initialState.manageMeasurementPointLists,
      manageUserQueue: initialState.manageUserQueue,
      manageInventory: initialState.manageInventory
    };
  },
  13: state => {
    const prevState = state as IinitialState;
    return {
      ...prevState,
      manageMeasurementPointLists: initialState.manageMeasurementPointLists,
      measurementPointResults: initialState.measurementPointResults
    };
  }
} as MigrationManifest;
