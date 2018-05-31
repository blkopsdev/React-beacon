export interface Iuser {
  password: string;
  username: string;
  isAuthenticated: boolean;
}

export interface InitialState {
  user: Iuser;
  ajaxCallsInProgress: number;
}

// these are copied from react-redux-toastr beacuse could not figure out any other way to make typescript happy
export type transitionInType = 'bounceIn' | 'bounceInDown' | 'fadeIn';
export type transitionOutType = 'bounceOut' | 'bounceOutUp' | 'fadeOut';
