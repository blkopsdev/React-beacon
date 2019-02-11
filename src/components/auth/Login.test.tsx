import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../../store/configureStore';
import Login from './Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

const { store, persistor } = configureStore();

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Login />
        </Router>
      </PersistGate>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
