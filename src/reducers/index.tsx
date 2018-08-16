import { reducer as toastr } from 'react-redux-toastr';
import { combineReducers } from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import user from './userReducer';
import redirect from './redirectToReferrerReducer';
import userQueue from './userQueueReducer';
import customers from './customersReducer';
import facilities from './facilitiesReducer';
import createShowModalWithNamedType from './userQueueModalsReducer';

const rootReducer = combineReducers({
  ajaxCallsInProgress,
  toastr,
  user,
  redirect,
  userQueue,
  customers,
  facilities,
  showEditUserModal: createShowModalWithNamedType('EDIT_USER'),
  showEditCustomerModal: createShowModalWithNamedType('EDIT_COMPANY'),
  showEditFacilityModal: createShowModalWithNamedType('EDIT_FACILITY')
});

export default rootReducer;
