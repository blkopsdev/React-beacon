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
interface IbaseDataObject {
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
  standard: IbaseDataObject;
  Brand: Ibrand;
  Manufacturer: IbaseDataObject;
  GasType: IgasType;
  Power: IbaseDataObject;
  SystemSize: IsystemSize;
  ProductGroup: IproductGroup;
  Installs: IinstallBase;
}

export interface IuserQueue {
  page: number;
  data: IqueueObject[];
  totalPages: number;
}

export interface IuserManage {
  page: number;
  data: Iuser[];
  totalPages: number;
}
export interface IteamManage {
  page: number;
  data: Iuser[];
  totalPages: number;
}
export interface ImanageInventory {
  page: number;
  data: Iproduct[];
  totalPages: number;
}

export interface Iredirect {
  redirectToReferrer: boolean;
  pathname: string;
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
  showEditUserModal: boolean;
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  showEditQueueUserModal: boolean;
  showEditProfileModal: boolean;
  showSecurityFunctionsModal: boolean;
  showEditTeamModal: boolean;
  showEditInventoryModal: boolean;
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

// these are copied from react-redux-toastr beacuse could not figure out any other way to make typescript happy
export type transitionInType = 'bounceIn' | 'bounceInDown' | 'fadeIn';
export type transitionOutType = 'bounceOut' | 'bounceOutUp' | 'fadeOut';
