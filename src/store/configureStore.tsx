import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { IinitialState } from '../models';
import rootReducer from '../reducers';

export default function configureStore(intialState: IinitialState) {
  if (process.env.NODE_ENV !== 'production') {
    return createStore(
      rootReducer,
      intialState,
      require('redux-devtools-extension').composeWithDevTools(
        applyMiddleware(
          thunk,
          require('redux-immutable-state-invariant').default()
        )
      )
    );
  } else {
    return createStore(rootReducer, intialState, applyMiddleware(thunk));
  }
}
