import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';

import { createShowModalWithNamedType } from './commonReducers';
import ajaxCallsInProgress from './ajaxStatusReducer';
import customers from './customersReducer';
import facilities from './facilitiesReducer';
import manageInventory, { productInfo } from './manageInventoryReducer';
import redirect from './redirectToReferrerReducer';
import manageTeam from './manageTeamReducer';
import user from './userReducer';
import manageUser from './manageUserReducer';
import manageUserQueue from './manageUserQueueReducer';
import manageProductQueue from './manageProductQueueReducer';
import manageJob from './manageJobReducer';
import manageLocation from './manageLocationReducer';
import training from './trainingReducer';
import manageTraining from './manageTrainingReducer';
import manageMeasurementPointLists from './manageMeasurementPointListsReducer';
import measurementPointResults from './measurementPointResultsReducer';
import { manageReportReducer } from './manageReportReducer';

const rootReducer = combineReducers({
  ajaxCallsInProgress,
  toastr,
  user,
  redirect,
  manageUserQueue,
  manageUser,
  manageJob,
  manageTeam,
  manageLocation,
  customers,
  facilities,
  manageInventory,
  manageProductQueue,
  productInfo,
  training,
  manageTraining,
  manageMeasurementPointLists,
  measurementPointResults,
  manageReport: manageReportReducer,
  showEditCustomerModal: createShowModalWithNamedType('EDIT_CUSTOMER'),
  showEditFacilityModal: createShowModalWithNamedType('EDIT_FACILITY'),
  showEditProfileModal: createShowModalWithNamedType('EDIT_PROFILE'),
  showSecurityFunctionsModal: createShowModalWithNamedType('SECURITY_FUNCTIONS')
});

export default rootReducer;
