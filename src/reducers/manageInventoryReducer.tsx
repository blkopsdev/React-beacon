import * as types from '../actions/actionTypes';
import {
  Iproduct,
  ImanageInventory,
  IproductInfo,
  Ibrand,
  IgasType,
  IbaseDataObject,
  IproductGroup,
  Isubcategory,
  IsystemSize,
  Ioption
} from '../models';
import initialState, { initialOption } from './initialState';
import { pickBy, map, filter } from 'lodash';
import { FormUtil } from '../components/common/FormUtil';

function dataReducer(state: Iproduct[] = [], action: any): Iproduct[] {
  switch (action.type) {
    case types.GET_INVENTORY_SUCCESS:
      return action.inventory;
    // return map(action.data, d => {
    //   return {
    //     ...pickBy(d, (property, key) => property !== null)
    //   };
    // });
    case types.PRODUCT_UPDATE_SUCCESS:
      const filteredProducts = filter(state, p => p.id !== action.product.id);
      const updatedProduct = {
        ...pickBy(action.product, (property, key) => property !== null)
      };

      return [...filteredProducts, updatedProduct] as Iproduct[];
    case types.PRODUCT_ADD_SUCCESS:
      const securityFunct = map(action.user.securityFunctions, securityF => {
        return securityF.toUpperCase();
      });
      const updatedTeamMember = {
        ...pickBy(action.user, (property, key) => property !== null),
        securityFunctions: securityFunct
      };

      return [...state, updatedTeamMember] as Iproduct[];

    case types.USER_LOGOUT_SUCCESS:
      return [];
    default:
      return state;
  }
}

function pageReducer(state: number = 1, action: any): number {
  switch (action.type) {
    case types.INVENTORY_INCREMENT:
      return state + 1;
    case types.INVENTORY_DECREMENT:
      if (state > 1) {
        return state - 1;
      }
    case types.USER_LOGOUT_SUCCESS:
      return 1;
    default:
      return state;
  }
}
function totalPagesReducer(state: number = 1, action: any): number {
  switch (action.type) {
    case types.INVENTORY_TOTAL_PAGES:
      if (action.pages && action.pages > 0) {
        return action.pages;
      }
      return state;
    case types.USER_LOGOUT_SUCCESS:
      return 1;
    default:
      return state;
  }
}

function selectedReducer(state: Ioption = initialOption, action: any): Ioption {
  switch (action.type) {
    case types.SET_SELECTED_FACILITY:
      return action.facility;
    case types.USER_LOGOUT_SUCCESS:
      return initialOption;
    default:
      return state;
  }
}

export default function ManageInventory(
  state: ImanageInventory = initialState.manageInventory,
  action: any
) {
  return {
    data: dataReducer(state.data, action),
    page: pageReducer(state.page, action),
    totalPages: totalPagesReducer(state.totalPages, action),
    selectedFacility: selectedReducer(state.selectedFacility, action)
  };
}
/*
Brand, GasType, Main Category, Manufacturer, Power, Product Group, Standard, Subcategory, System Size 
*/
export function productInfo(
  state: IproductInfo = initialState.productInfo,
  action: any
) {
  switch (action.type) {
    case types.GET_PRODUCT_INFO_SUCCESS:
      const pi = action.data;
      const brands = pi[0] as Ibrand[];
      const gasTypes = pi[1] as IgasType[];
      const mainCategories = pi[2] as IbaseDataObject[];
      const manufacturers = pi[3] as IbaseDataObject[];
      const powers = pi[4] as IbaseDataObject[];
      const productGroups = pi[5] as IproductGroup[];
      const standards = pi[6] as IbaseDataObject[];
      const subcategories = pi[7] as Isubcategory[];
      const systemSizes = pi[8] as IsystemSize[];

      // an options version of each one
      const brandOptions = FormUtil.convertToOptions(pi[0]);
      const gasTypeOptions = FormUtil.convertToOptions(pi[1]);
      const mainCategoryOptions = FormUtil.convertToOptions(pi[2]);
      const manufacturerOptions = FormUtil.convertToOptions(pi[3]);
      const powerOptions = FormUtil.convertToOptions(pi[4]);
      const productGroupOptions = FormUtil.convertToOptions(pi[5]);
      const standardOptions = FormUtil.convertToOptions(pi[6]);
      const subcategoryOptions = FormUtil.convertToOptions(pi[7]);
      const systemSizeOptions = FormUtil.convertToOptions(pi[8]);

      return {
        brands,
        gasTypes,
        mainCategories,
        manufacturers,
        powers,
        productGroups,
        standards,
        subcategories,
        systemSizes,
        brandOptions,
        gasTypeOptions,
        mainCategoryOptions,
        manufacturerOptions,
        powerOptions,
        productGroupOptions,
        standardOptions,
        subcategoryOptions,
        systemSizeOptions
      };
    case types.USER_LOGOUT_SUCCESS:
      return initialState.productInfo;
    default:
      return state;
  }
}
