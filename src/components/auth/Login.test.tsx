import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import initialState from '../../reducers/initialState';
import configureStore from '../../store/configureStore';
import Login from './Login';
import { loadState } from '../../store/localStorage';
import { BrowserRouter as Router } from 'react-router-dom';

const persistedState = loadState('state-core-care');
const store = configureStore(persistedState || initialState);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Login />
      </Router>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
