import {reducer as toastr} from 'react-redux-toastr'
import { combineReducers } from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import user from './userReducer';


const rootReducer = combineReducers({
  ajaxCallsInProgress,
  toastr,
  user
});

export default rootReducer;
