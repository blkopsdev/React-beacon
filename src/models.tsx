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
  customers: Icustomer[];
  facilities: Ifacility[];
  showEditUserModal: boolean;
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  showEditQueueUserModal: boolean;
  showEditProfileModal: boolean;
}
export interface Itile {
  icon: string | string[];
  title: string;
  src: string;
  color: string;
  width: number;
  height: number;
  url: string;
  securityFunction: string;
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
