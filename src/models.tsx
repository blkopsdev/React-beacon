export interface Iuser {
  password: string;
  username: string;
  isAuthenticated: boolean;
  token: string;
  email: string;
}

export interface Iredirect {
  redirectToReferrer: boolean;
  pathname: string;
}
export interface InitialState {
  user: Iuser;
  ajaxCallsInProgress: number;
  redirect: Iredirect;
}

// these are copied from react-redux-toastr beacuse could not figure out any other way to make typescript happy
export type transitionInType = 'bounceIn' | 'bounceInDown' | 'fadeIn';
export type transitionOutType = 'bounceOut' | 'bounceOutUp' | 'fadeOut';
