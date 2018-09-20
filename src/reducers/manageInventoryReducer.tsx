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
  Ioption,
  IinstallBase
} from '../models';
import initialState, { initialOption } from './initialState';
import { pickBy, map, filter, keyBy, find } from 'lodash';
import { FormUtil } from '../components/common/FormUtil';
import cartReducer, { getAddedIDs, getQuantity } from './cartReducer';
import { modalToggleWithName } from './userQueueModalsReducer';

function dataReducer(state: Iproduct[] = [], action: any): Iproduct[] {
  switch (action.type) {
    case types.GET_INVENTORY_SUCCESS:
      // return action.inventory;
      return map(action.inventory, d => {
        return {
          ...(pickBy(d, (property, key) => property !== null) as Iproduct)
        };
      });
    case types.PRODUCT_UPDATE_SUCCESS:
      const filteredProducts = filter(state, p => p.id !== action.product.id);
      const updatedProduct = {
        ...pickBy(action.product, (property, key) => property !== null)
      };

      return [...filteredProducts, updatedProduct] as Iproduct[];
    case types.PRODUCT_ADD_SUCCESS:
      // const updatedProductB = {
      //   ...pickBy(action.product, (property, key) => property !== null)
      // };

      // return [...state, updatedProductB] as Iproduct[];

      // TODO not showing added product until we build the queue
      return state;
    case types.INSTALL_UPDATE_SUCCESS:
      const filteredProductsI = filter(
        state,
        p => p.id !== action.install.productID
      );
      const oldProduct = find(state, o => o.id === action.install.productID);
      if (oldProduct) {
        const filteredInstalls = filter(
          oldProduct.installs,
          i => i.id !== action.install.id
        );
        const updatedInstall = {
          ...pickBy(action.install, (property, key) => property !== null)
        };
        const newInstalls = { ...filteredInstalls, updatedInstall };
        const updatedProductI = { ...oldProduct, installs: newInstalls };
        return [...filteredProductsI, updatedProductI] as Iproduct[];
      }
      return state;

    /*
    * It is possible to add multiple installs at the same time.
    */
    case types.INSTALL_ADD_SUCCESS:
      // const filteredProductsJ = filter(
      //   state,
      //   p => p.id !== action.productID
      // );
      const oldProductB = find(state, o => o.id === action.productID);
      if (oldProductB) {
        const installsToAdd = map(action.installs, install => {
          return { ...pickBy(install, (property, key) => property !== null) };
        });
        const newInstalls = [
          ...oldProductB.installs,
          ...installsToAdd
        ] as IinstallBase[];
        // const updatedProductE = { ...oldProductB, installs: newInstalls };
        return map(state, pr => {
          if (pr.id === action.productID) {
            return { ...pr, installs: newInstalls };
          } else {
            return pr;
          }
        });
        // return [...filteredProductsJ, updatedProductE] as Iproduct[];
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

// function quoteRequestReducer( state: )

export default function ManageInventory(
  state: ImanageInventory = initialState.manageInventory,
  action: any
) {
  return {
    data: dataReducer(state.data, action),
    page: pageReducer(state.page, action),
    totalPages: totalPagesReducer(state.totalPages, action),
    selectedFacility: selectedReducer(state.selectedFacility, action),
    cart: cartReducer(state.cart, action),
    productInfo: productInfo(state.productInfo, action),
    showEditQuoteModal: modalToggleWithName(
      state.showEditQuoteModal,
      action,
      'EDIT_QUOTE'
    ),
    showEditProductModal: modalToggleWithName(
      state.showEditProductModal,
      action,
      'EDIT_PRODUCT'
    ),
    showEditInstallModal: modalToggleWithName(
      state.showEditInstallModal,
      action,
      'EDIT_INSTALL'
    )
    // quoteRequestItems: quoteRequestReducer(state.quoteRequestItems, action)
  };
}
/*
Brand, GasType, Main Category, Manufacturer, Power, Product Group, Standard, Subcategory, System Size 
*/
export function productInfo(
  state: IproductInfo = initialState.manageInventory.productInfo,
  action: any
): IproductInfo {
  switch (action.type) {
    case types.GET_PRODUCT_INFO_SUCCESS:
      const pi = action.data;
      const brands = keyBy(pi[0], (item: Ibrand) => item.id);
      const gasTypes = keyBy(pi[1], (item: IgasType) => item.id);
      const mainCategories = keyBy(pi[2], (item: IbaseDataObject) => item.id);
      const manufacturers = keyBy(pi[3], (item: IbaseDataObject) => item.id);
      const powers = keyBy(pi[4], (item: IbaseDataObject) => item.id);
      const productGroups = keyBy(pi[5], (item: IproductGroup) => item.id);
      const standards = keyBy(pi[6], (item: IbaseDataObject) => item.id);
      const subcategories = keyBy(pi[7], (item: Isubcategory) => item.id);
      const systemSizes = keyBy(pi[8], (item: IsystemSize) => item.id);

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
      return initialState.manageInventory.productInfo;
    default:
      return state;
  }
}

// getters for shopping cart
// const getAddedIds = (cart: IshoppingCart) => getAddedIDs(cart)
// const getQuantity = (cart: IshoppingCart, id: string) => getQuantity(cart, id)
const getProduct = (productInfoState: IproductInfo, id: string) =>
  productInfoState.productGroups[id];

export const getTotal = (state: ImanageInventory) =>
  state.cart.addedIDs.reduce(
    (total, id) => total + getQuantity(state.cart, id),
    0
  );

export const getCartProducts = (state: ImanageInventory) =>
  getAddedIDs(state.cart).map(id => ({
    ...getProduct(state.productInfo, id),
    quantity: getQuantity(state.cart, id)
  }));
