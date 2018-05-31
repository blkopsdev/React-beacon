import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import initialState from '../../reducers/initialState';
import configureStore from '../../store/configureStore';
import LoginForm from './LoginForm';
import { loadState } from '../../store/localStorage';

const persistedState = loadState('state-core-care');
const store = configureStore(persistedState || initialState);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <LoginForm />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
