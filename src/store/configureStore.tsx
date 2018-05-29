import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { InitialState } from '../models';
import rootReducer from '../reducers';


export function configureStore(intialState : InitialState) {
  return createStore(
    rootReducer,
    intialState,
    require('redux-devtools-extension').composeWithDevTools(
      applyMiddleware(thunk, require('redux-immutable-state-invariant').default())
    ));
}

export function configureStoreProduction(intialState: InitialState) {
  return createStore(
    rootReducer,
    intialState,
    applyMiddleware(thunk)
    );
}