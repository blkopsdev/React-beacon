import initialState from './initialState';
import * as types from '../actions/actionTypes';

export default function manageBrandReducer(
  state = initialState.manageBrand,
  action: any
) {
  switch (action.type) {
    case types.LOAD_BRANDS_SUCCESS:
      return { ...state, brandList: action.payload };
    case types.ADD_BRAND_SUCCESS:
      // let list = state.brandList;
      // list.push(action.payload);
      return { ...state, brandList: action.payload };
    case types.REMOVE_BRAND_SUCCESS:
      return { ...state, brandList: action.payload };
    default:
      return state;
  }
}
