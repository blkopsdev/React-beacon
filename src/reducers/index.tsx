import { reducer as toastr } from 'react-redux-toastr';
import { combineReducers } from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import user from './userReducer';
import redirect from './redirectToReferrerReducer';
import userQueue from './userQueueReducer';
import customers from './customersReducer';
import facilities from './facilitiesReducer';

const rootReducer = combineReducers({
  ajaxCallsInProgress,
  toastr,
  user,
  redirect,
  userQueue,
  customers,
  facilities
});

export default rootReducer;
