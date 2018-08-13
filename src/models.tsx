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
  tempAddress?: string;
  tempAddress2?: string;
  tempCity?: string;
  tempState?: string;
  tempZip?: string;
  createDate?: string;
}
// export interface IuserQueue {
//   [key: string]: Iuser;
// }
// export interface IuserQueue {
//   [key: string]: Iuser;
// }
export interface IqueueUser {
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

export interface Iredirect {
  redirectToReferrer: boolean;
  pathname: string;
}
export interface InitialState {
  user: Iuser;
  ajaxCallsInProgress: number;
  redirect: Iredirect;
  userQueue: ItempUser[];
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

// these are copied from react-redux-toastr beacuse could not figure out any other way to make typescript happy
export type transitionInType = 'bounceIn' | 'bounceInDown' | 'fadeIn';
export type transitionOutType = 'bounceOut' | 'bounceOutUp' | 'fadeOut';
