import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';

import { createShowModalWithNamedType } from './commonReducers';
import ajaxCallsInProgress from './ajaxStatusReducer';
import customers from './customersReducer';
import facilities from './facilitiesReducer';
import manageInventory, { productInfo } from './manageInventoryReducer';
import redirect from './redirectToReferrerReducer';
import teamManage from './teamManageReducer';
import user from './userReducer';
import userManage from './userManageReducer';
import userQueue from './userQueueReducer';

const rootReducer = combineReducers({
  ajaxCallsInProgress,
  toastr,
  user,
  redirect,
  userQueue,
  userManage,
  teamManage,
  customers,
  facilities,
  manageInventory,
  productInfo,
  showEditQueueUserModal: createShowModalWithNamedType('EDIT_QUEUE_USER'),
  showEditCustomerModal: createShowModalWithNamedType('EDIT_CUSTOMER'),
  showEditFacilityModal: createShowModalWithNamedType('EDIT_FACILITY'),
  showEditUserModal: createShowModalWithNamedType('EDIT_USER'),
  showEditTeamModal: createShowModalWithNamedType('EDIT_TEAM'),
  showEditProfileModal: createShowModalWithNamedType('EDIT_PROFILE'),
  showSecurityFunctionsModal: createShowModalWithNamedType('SECURITY_FUNCTIONS')
});

export default rootReducer;
