import { throttle } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import LoginLayout from './components/auth/LoginLayout';
import initialState from './reducers/initialState';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import { loadState, saveState } from './store/localStorage';
import Dashboard from './components/dashboard/Dashboard';

// import project css
import 'bootstrap/dist/css/bootstrap.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './index.css';

const persistedState = loadState('state-core-care');
const store = configureStore(persistedState || initialState);

// throttle ensures that we never write to
// localstorage more than once per second
store.subscribe(
  throttle(() => {
    saveState(
      {
        user: store.getState().user
      },
      'state-core-care'
    );
  }, 1000)
);

const NoMatch = ({ location }: any) => {
  console.error(`no match for route: ${location.pathname}`);
  return (
    <h3>
      <code>{location.pathname}</code> does not exist
    </h3>
  );
};

// TODO get the user object from Redux and check if they are authenticated
const fakeAuth = { isAuthenticated: true };

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props: any) =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const headerImg = require('src/images/KittenLogo@2x.png');

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <div className="header">
          <img src={headerImg} />
        </div>
        <Switch>
          <Route exact path="/" component={LoginLayout} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route component={NoMatch} />
        </Switch>
        <ReduxToastr position={'top-right'} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
