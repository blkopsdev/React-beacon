import { MigrationManifest } from 'redux-persist';
import { IinitialState } from 'src/models';

/*
* Migration 1 runs when upgrading from 0 to 1
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
  }
} as MigrationManifest;
