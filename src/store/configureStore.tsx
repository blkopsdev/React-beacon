import {
  applyMiddleware,
  createStore,
  Middleware,
  Store,
  AnyAction,
  compose
} from 'redux';
import {
  createMigrate,
  persistReducer,
  persistStore,
  TransformIn,
  createTransform
} from 'redux-persist';
import { createOffline } from '@redux-offline/redux-offline';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import * as localForage from 'localforage';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults/index';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import { IinitialState } from '../models';
import { migrations } from './migrations';
import { constants } from 'src/constants/constants';
import rootReducer from '../reducers';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import TrackJSLogger from './TrackJSLogger';

/*
* handle persisisting date objects
*/
const replacer = (key: string, value: any) =>
  value instanceof Date ? value.toISOString() : value;

const reviver = (key: string, value: any) =>
  typeof value === 'string' &&
  value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    ? new Date(value)
    : value;

export const encode = (toDeshydrate: TransformIn<IinitialState, string>) =>
  JSON.stringify(toDeshydrate, replacer);

export const decode = (toRehydrate: string) => JSON.parse(toRehydrate, reviver);

const effect = (
  {
    axiosRequest,
    message
  }: { axiosRequest: AxiosRequestConfig; message: string },
  action: any
) =>
  axios(axiosRequest).catch(err => {
    console.error(message, err);
    constants.handleError(err, message);
    throw err;
  });

// if discard returns true, then it will try again
const discard = (error: AxiosError, action: any, retries: number) => {
  const { request, response } = error;
  if (!request) {
    throw error;
  } // There was an error creating the request
  if (!response) {
    return false;
  } // There was no response
  return 400 <= response.status && response.status <= 500; // if it is a 400 error then discard, TODO temporarily set this to include 500 exactly because I am not sure how to handle this better...
  //  if retryScheduled true and online true, we chould show a banner with a button to discard the request.
};

const persistConfig = {
  key: 'state-core-care-web',
  debounce: 500,
  storage: localForage,
  version: parseInt(
    (process.env.REACT_APP_VERSION || '0.0.0').replace(/\./g, ''),
    10
  ),
  migrate: createMigrate(migrations, { debug: true }),
  blacklist: [
    'showEditProfileModal',
    'ajaxCallsInProgress',
    'facilities',
    'showEditCustomerModal',
    'showEditFacilityModal',
    'showEditProfileModal',
    'showSecurityFunctionsModal'
  ],
  stateReconciler: hardSet,
  transforms: [createTransform(encode, decode)]
};
//   blacklist: ['toastr', 'showEditProfileModal'],  we can not blacklist the toastr because it causes the app to crash on load
// we want to backlist toastr, because we do not want auth errors to show after it has successfully re-authorized.

const {
  middleware: offlineMiddleware,
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore
} = createOffline({
  ...offlineConfig,
  persist: false,
  effect,
  discard
});

const persistedReducer = persistReducer(
  persistConfig,
  offlineEnhanceReducer(rootReducer)
);

export default function configureStore() {
  if (process.env.NODE_ENV !== 'production') {
    // if (false) {
    const composeEnhancers = require('redux-devtools-extension').composeWithDevTools(
      // const composeEnhancers = require('remote-redux-devtools').composeWithDevTools( // for inspecting while using Edge browser remotedev.io/local
      {
        actionsBlacklist: [
          'persist/REHYDRATE',
          'persist/PERSIST',
          'BEGIN_AJAX_CALL'
        ], // this improves the perfomance of redux devtools
        autoPause: true,
        latency: 1000,
        maxAge: 20,
        shouldHotReload: false,
        stateSanitizer: (state: IinitialState) =>
          state.manageUserQueue
            ? { ...state, manageUserQueue: '<<LONG_BLOB>>' }
            : state
      }
    );
    const store = createStore(
      persistedReducer,
      composeEnhancers(
        offlineEnhanceStore,
        applyMiddleware(
          thunk as ThunkMiddleware<IinitialState, any>,
          require('redux-immutable-state-invariant').default(),
          offlineMiddleware as Middleware<any, any, any>
        )
      )
    ) as Store<any, AnyAction>;
    const persistor = persistStore(store);
    return { persistor, store };
  } else {
    const store = createStore(
      persistedReducer,
      compose(
        applyMiddleware(
          thunk as ThunkMiddleware<IinitialState, any>,
          offlineMiddleware as Middleware<any, any, any>,
          TrackJSLogger
        ),
        offlineEnhanceStore
      )
    ) as Store<any, AnyAction>;
    const persistor = persistStore(store);
    return { persistor, store };
  }
}
