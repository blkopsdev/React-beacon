import initialState from './initialState';
import * as types from '../actions/actionTypes';
import {Ibrand} from "../models";

export default function manageBrandReducer(
  state = initialState.manageBrand,
  action: any
) {
  switch (action.type) {
    case types.LOAD_BRANDS_SUCCESS:
      return { ...state, brandList: action.payload };
    case types.ADD_BRAND_SUCCESS:
      const list = state.brandList;
      const item: Ibrand = action.payload;
      // @ts-ignore
      list.push(item);
      return { ...state, brandList: list };
    case types.EDIT_BRAND_SUCCESS:
      const brandList = state.brandList.map((brand: any) => {
        if(brand.id === action.payload.id){
          return action.payload;
        }else {
          return  brand;
        }
      });

      return { ...state, brandList };
    case types.REMOVE_BRAND_SUCCESS:
      return { ...state, brandList: action.payload };
    case types.TOGGLE_MODAL_EDIT_BRAND:
      return {...state, showEditBrandModal: !state.showEditBrandModal};
    default:
      return state;
  }
}
