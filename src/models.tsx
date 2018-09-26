import { ThunkAction } from 'redux-thunk';
import { SortingRule } from 'react-table';

export interface ItableFiltersReducer {
  search: string;
  page: number;
  facility?: Ioption;
  customer?: Ioption;
  productGroup?: Ioption;
  manufacturer?: Ioption;
  sorted?: SortingRule[];
}
export interface ItableFiltersParams {
  search?: string;
  page?: number;
  facility?: Ioption;
  customer?: Ioption;
  productGroup?: Ioption;
  manufacturer?: Ioption;
  sorted?: SortingRule[];
}

export interface Iuser {
  password: string;
  username: string;
  isAuthenticated: boolean;
  token: string;
  email: string;
  securityFunctions: string[];
  first: string;
  last: string;
  position: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  id: string;
  managerID?: string;
  tempAddress?: string;
  tempAddress2?: string;
  tempCity?: string;
  tempState?: string;
  tempZip?: string;
  lastLoginDate?: string;
  createDate?: string;
  customerID: string;
  facilities: Array<{ id: string }>;
  hasTeamMembers: boolean;
  appVersion: string;
}
// export interface IuserQueue {
//   [key: string]: Iuser;
// }
// export interface IuserQueue {
//   [key: string]: Iuser;
// }
export interface IqueueObject {
  id: string;
  user: Iuser;
}

export interface ItempUser {
  email: string;
  first: string;
  last: string;
  position: string;
  tempAddress: string;
  tempAddress2: string;
  tempCity: string;
  tempState: string;
  tempZip: string;
}
export interface IbaseDataObject {
  id: string;
  name: string;
  createDate: string;
  updateDate: string;
  creatorID: string;
  updaterID: string;
}
// export interface ImainCategory extends IbaseDataObject {}
export interface Isubcategory extends IbaseDataObject {
  mainCategoryID: string;
  mainCategory: IbaseDataObject;
}
// export interface Istandard extends IbaseDataObject {}
export interface Ibrand extends IbaseDataObject {
  code: string;
}
// export interface Imanufacturer extends IbaseDataObject {}
export interface IgasType extends IbaseDataObject {
  code: string;
}
// export interface Ipower extends IbaseDataObject {}
export interface IsystemSize extends IbaseDataObject {
  code: string;
}
export interface IproductGroup extends IbaseDataObject {
  code: string;
}
export interface IinstallBase extends IbaseDataObject {
  code: string;

  productID: string;
  product: Iproduct;
  facilityID: string;
  facility: Ifacility;
  nickname: string;
  remarks: string;
  serialNumber: string;
  rfid: string;
  installDate: string;
  prodDate: string;
}

export interface Iproduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  imagePath: string;
  subcategoryID: string;
  standardID: string;
  brandID: string;
  manufacturerID: string;
  gasTypeID: string;
  powerID: string;
  systemSizeID: string;
  productGroupID: string;
  subcategory: Isubcategory;
  // standard: IbaseDataObject;
  // brand: Ibrand;
  // manufacturer: IbaseDataObject;
  // gasType: IgasType;
  // power: IbaseDataObject;
  // systemSize: IsystemSize;
  // productGroup: IproductGroup;
  installs: IinstallBase[];
  quantity: number;
}
export interface IquoteItem {
  productID: string;
  quantity: number;
}

export interface IuserQueue {
  page: number;
  data: IqueueObject[];
  totalPages: number;
  showEditQueueUserModal: boolean;
}

export interface IuserManage {
  page: number;
  data: Iuser[];
  totalPages: number;
  showEditUserModal: boolean;
}
export interface IteamManage {
  page: number;
  data: Iuser[];
  totalPages: number;
  showEditTeamModal: boolean;
}

export interface IshoppingCart {
  addedIDs: string[];
  productsByID: { [key: string]: Iproduct };
}
export interface ImanageInventory {
  page: number;
  data: Iproduct[];
  totalPages: number;
  cart: IshoppingCart;
  productInfo: IproductInfo;
  showEditProductModal: boolean;
  showEditInstallModal: boolean;
  showEditQuoteModal: boolean;
  tableFilters: ItableFiltersReducer;
}

export interface Iredirect {
  redirectToReferrer: boolean;
  pathname: string;
}
export interface IproductInfo {
  brands: { [key: string]: Ibrand };
  gasTypes: { [key: string]: IgasType };
  manufacturers: { [key: string]: IbaseDataObject };
  mainCategories: { [key: string]: IbaseDataObject };
  powers: { [key: string]: IbaseDataObject };
  productGroups: { [key: string]: IproductGroup };
  standards: { [key: string]: IbaseDataObject };
  subcategories: { [key: string]: Isubcategory };
  systemSizes: { [key: string]: IsystemSize };
  brandOptions: Ioption[];
  gasTypeOptions: Ioption[];
  mainCategoryOptions: Ioption[];
  manufacturerOptions: Ioption[];
  powerOptions: Ioption[];
  productGroupOptions: Ioption[];
  standardOptions: Ioption[];
  subcategoryOptions: Ioption[];
  systemSizeOptions: Ioption[];
}

export interface IinitialState {
  user: Iuser;
  ajaxCallsInProgress: number;
  redirect: Iredirect;
  userQueue: IuserQueue;
  userManage: IuserManage;
  teamManage: IteamManage;
  manageInventory: ImanageInventory;
  customers: Icustomer[];
  facilities: Ifacility[];
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  showEditProfileModal: boolean;
  showSecurityFunctionsModal: boolean;
}
export interface Itile {
  icon: string | string[];
  title: string;
  src: string;
  srcBanner: string;
  color: string;
  width: number;
  height: number;
  url: string;
  securityFunction: string;
  description: string;
}

export interface Icustomer {
  id: string;
  name: string;
  vat?: string;
}
export interface Ifacility {
  id: string;
  name: string;
  customerID: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Ioption {
  value: string;
  label: string;
}

// these are copied from react-redux-toastr beacuse could not figure out any other way to make typescript happy
export type transitionInType = 'bounceIn' | 'bounceInDown' | 'fadeIn';
export type transitionOutType = 'bounceOut' | 'bounceOutUp' | 'fadeOut';

export type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;
