import { pickBy, map, keyBy, find, filter } from 'lodash';

import { FormUtil } from '../components/common/FormUtil';
import {
  Iproduct,
  ImanageInventoryReducer,
  IproductInfo,
  Ibrand,
  IproductType,
  IbaseDataObject,
  Isubcategory,
  IsystemSize,
  IinstallBase
} from '../models';
import {
  createTableFiltersWithName,
  modalToggleWithName
} from './commonReducers';
import { cartReducerWithName } from './cartReducer';
import initialState, { initialProduct } from './initialState';
import * as types from '../actions/actionTypes';

function dataReducer(state: Iproduct[] = [], action: any): Iproduct[] {
  switch (action.type) {
    case types.GET_INVENTORY_SUCCESS:
      return map(action.inventory, (d: Iproduct) => {
        const filteredInstalls = filter(
          d.installs,
          item => item.isDeleted === false
        );
        return {
          ...(pickBy(d, (property, key) => property !== null) as Iproduct),
          installs: filteredInstalls
        };
      });
    case types.PRODUCT_UPDATE_SUCCESS:
      const updatedProduct = pickBy(
        action.product,
        (property, key) => property !== null
      );

      return map(state, pr => {
        if (pr.id === updatedProduct.id) {
          return { ...pr, ...updatedProduct };
        } else {
          return pr;
        }
      });

    case types.PRODUCT_ADD_SUCCESS:
      // TODO not showing added product until we build the queue
      // return map(state, pr => {
      //   if (pr.id === action.product.id){
      //     return pickBy(action.product, (property, key) => property !== null) as Iproduct
      //   } else {
      //     return pr;
      //   }
      // })

      return state;
    case types.INSTALL_UPDATE_SUCCESS:
      const oldProduct = find(state, o => o.id === action.install.productID);
      if (oldProduct) {
        const newInstalls = map(oldProduct.installs, install => {
          if (install.id === action.install.id) {
            return pickBy(
              action.install,
              (property, key) => property !== null
            ) as IinstallBase;
          } else {
            return install;
          }
        });

        return map(state, pr => {
          if (pr.id === action.install.productID) {
            return { ...oldProduct, installs: newInstalls };
          } else {
            return pr;
          }
        });
      }
      return state;
    case types.INSTALL_DELETE_SUCCESS:
      const oldProductE = find(state, o => o.id === action.productID);
      if (oldProductE) {
        const filteredInstalls = filter(
          oldProductE.installs,
          ins => ins.id !== action.installID
        );
        return map(state, pr => {
          if (pr.id === action.productID) {
            return { ...pr, installs: filteredInstalls };
          } else {
            return pr;
          }
        });
      }
      return state;

    /*
    * It is possible to add multiple installs at the same time.
    */
    case types.INSTALL_ADD_SUCCESS:
      const oldProductB = find(state, o => o.id === action.productID);
      if (oldProductB) {
        const installsToAdd = map(action.installs, install => {
          return pickBy(install, (property, key) => property !== null);
        });
        const newInstalls = [
          ...oldProductB.installs,
          ...installsToAdd
        ] as IinstallBase[];
        return map(state, pr => {
          if (pr.id === action.productID) {
            return { ...pr, installs: newInstalls };
          } else {
            return pr;
          }
        });
      }
      return state;

    case types.USER_LOGOUT_SUCCESS:
      return [];
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

function selectedProductReducer(
  state: Iproduct = initialProduct,
  action: any
): Iproduct {
  switch (action.type) {
    case types.SET_SELECTED_PRODUCT:
      return action.product ? action.product : initialProduct;
    case types.USER_LOGOUT_SUCCESS:
      return initialProduct;
    default:
      return state;
  }
}

function newProductsReducer(
  state: { [key: string]: Iproduct } = {},
  action: any
): { [key: string]: Iproduct } {
  switch (action.type) {
    case types.GET_PRODUCTS_SUCCESS:
      return action.products ? action.products : {};
    // return map(action.products, d => {
    //   return {
    //     ...(pickBy(d, (property, key) => property !== null) as Iproduct)
    //   };
    // });
    case types.NEW_PRODUCTS_RESET:
      return {};
    case types.USER_LOGOUT_SUCCESS:
      return {};
    default:
      return state;
  }
}

export default function ManageInventory(
  state: ImanageInventoryReducer = initialState.manageInventory,
  action: any
): ImanageInventoryReducer {
  return {
    data: dataReducer(state.data, action),
    totalPages: totalPagesReducer(state.totalPages, action),
    cart: cartReducerWithName(state.cart, action, 'INVENTORY'),
    productInfo: productInfo(state.productInfo, action),
    selectedProduct: selectedProductReducer(state.selectedProduct, action),
    newProducts: newProductsReducer(state.newProducts, action),
    showShoppingCartModal: modalToggleWithName(
      state.showShoppingCartModal,
      action,
      'SHOPPING_CART_INVENTORY'
    ),
    showEditProductModal: modalToggleWithName(
      state.showEditProductModal,
      action,
      'EDIT_PRODUCT'
    ),
    showSearchNewProductsModal: modalToggleWithName(
      state.showSearchNewProductsModal,
      action,
      'SEARCH_NEW_PRODUCTS'
    ),
    showEditInstallModal: modalToggleWithName(
      state.showEditInstallModal,
      action,
      'EDIT_INSTALL'
    ),
    showInstallContactModal: modalToggleWithName(
      state.showInstallContactModal,
      action,
      'INSTALL_CONTACT'
    ),
    showImportInstall: modalToggleWithName(
      state.showImportInstall,
      action,
      'IMPORT_INSTALL'
    ),
    showMPResultModal: modalToggleWithName(
      state.showMPResultModal,
      action,
      'MP_RESULT'
    ),
    showMPResultHistoryModal: modalToggleWithName(
      state.showMPResultHistoryModal,
      action,
      'MP_RESULT_HISTORY'
    ),
    showMPResultNotes: modalToggleWithName(
      state.showMPResultNotes,
      action,
      'MP_RESULT_NOTES'
    ),
    tableFilters: createTableFiltersWithName(
      state.tableFilters,
      action,
      'MANAGE_INVENTORY'
    )
    // quoteRequestItems: quoteRequestReducer(state.quoteRequestItems, action)
  };
}
/*
Brand, productType, Main Category, Power, Product Group, Standard, Subcategory, System Size 
*/
export function productInfo(
  state: IproductInfo = initialState.manageInventory.productInfo,
  action: any
): IproductInfo {
  switch (action.type) {
    case types.GET_PRODUCT_INFO_SUCCESS:
      const pi = action.data;
      const brands = keyBy(pi[0], (item: Ibrand) => item.id);
      const productTypes = keyBy(pi[1], (item: IproductType) => item.id);
      const mainCategories = keyBy(pi[2], (item: IbaseDataObject) => item.id);
      const powers = keyBy(pi[3], (item: IbaseDataObject) => item.id);
      const standards = keyBy(pi[4], (item: IbaseDataObject) => item.id);
      const subcategories = keyBy(pi[5], (item: Isubcategory) => item.id);
      const systemSizes = keyBy(pi[6], (item: IsystemSize) => item.id);

      // an options version of each one
      const brandOptions = FormUtil.convertToOptions(pi[0]);
      const productTypeOptions = FormUtil.convertToOptions(pi[1]);
      const mainCategoryOptions = FormUtil.convertToOptions(pi[2]);
      const powerOptions = FormUtil.convertToOptions(pi[3]);
      const standardOptions = FormUtil.convertToOptions(pi[4]);
      const subcategoryOptions = FormUtil.convertToOptions(pi[5]);
      const systemSizeOptions = FormUtil.convertToOptions(pi[6]);

      return {
        brands,
        productTypes,
        mainCategories,
        powers,
        standards,
        subcategories,
        systemSizes,
        brandOptions,
        productTypeOptions,
        mainCategoryOptions,
        powerOptions,
        standardOptions,
        subcategoryOptions,
        systemSizeOptions
      };
    case types.UPDATE_PRODUCT_INFO_SUCCESS:
      return { ...state, ...action.payload };
    case types.USER_LOGOUT_SUCCESS:
      return initialState.manageInventory.productInfo;
    default:
      return state;
  }
}
