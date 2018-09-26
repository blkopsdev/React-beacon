import { applyMiddleware, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { IinitialState } from '../models';
import rootReducer from '../reducers';

export default function configureStore(intialState: IinitialState) {
  if (process.env.NODE_ENV !== 'production') {
    // if (false) {
    return createStore(
      rootReducer,
      intialState,
      require('redux-devtools-extension').composeWithDevTools(
        applyMiddleware(
          thunk as ThunkMiddleware<IinitialState, any>,
          require('redux-immutable-state-invariant').default()
        )
      )
    );
  } else {
    return createStore(rootReducer, intialState, applyMiddleware(thunk));
  }
}
