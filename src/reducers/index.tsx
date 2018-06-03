import { reducer as toastr } from 'react-redux-toastr';
import { combineReducers } from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import user from './userReducer';
import redirect from './redirectToReferrerReducer';

const rootReducer = combineReducers({
  ajaxCallsInProgress,
  toastr,
  user,
  redirect
});

export default rootReducer;
