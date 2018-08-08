import * as types from './actionTypes';

export function setLoginRedirect() {
  return (dispatch: any, getState: any) => {
    dispatch({ type: types.SET_REDIRECT_REFERRER });
    return Promise.resolve(true);
  };
}
export function removeLoginRedirect() {
  return (dispatch: any, getState: any) => {
    dispatch({ type: types.REMOVE_REDIRECT_REFERRER });
    return Promise.resolve(true);
  };
}

export function setRedirectPathname(pathname: string) {
  return (dispatch: any, getState: any) => {
    console.error(pathname);
    dispatch({ type: types.SET_REDIRECT_PATHNAME, pathname });
  };
}
