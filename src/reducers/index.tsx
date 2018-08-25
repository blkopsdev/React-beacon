import { reducer as toastr } from 'react-redux-toastr';
import { combineReducers } from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import user from './userReducer';
import redirect from './redirectToReferrerReducer';
import userQueue from './userQueueReducer';
import userManage from './userManageReducer';
import customers from './customersReducer';
import facilities from './facilitiesReducer';
import createShowModalWithNamedType from './userQueueModalsReducer';

const rootReducer = combineReducers({
  ajaxCallsInProgress,
  toastr,
  user,
  redirect,
  userQueue,
  userManage,
  customers,
  facilities,
  showEditQueueUserModal: createShowModalWithNamedType('EDIT_QUEUE_USER'),
  showEditCustomerModal: createShowModalWithNamedType('EDIT_CUSTOMER'),
  showEditFacilityModal: createShowModalWithNamedType('EDIT_FACILITY'),
  showEditUserModal: createShowModalWithNamedType('EDIT_USER'),
  showEditProfileModal: createShowModalWithNamedType('EDIT_PROFILE'),
  showSecurityFunctionsModal: createShowModalWithNamedType('SECURITY_FUNCTIONS')
});

export default rootReducer;
