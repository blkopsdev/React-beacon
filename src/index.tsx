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
import Login from './components/auth/Login';
import initialState from './reducers/initialState';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import { loadState, saveState } from './store/localStorage';
import { runWithAdal } from 'react-adal';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  faCog,
  faCalendarCheck,
  faTh,
  faCheck,
  faTimes
} from '@fortawesome/pro-regular-svg-icons';
library.add(faCog, faUsers, faCalendarCheck, faTh, faCheck, faTimes, faSearch);

import { authContext, isFullyAuthenticated } from './actions/userActions';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/header/Header';
import SignUpDirect from './components/auth/SignUpDirect';
import TwoPaneLayout from './components/common/TwoPaneLayout';

// import project css
import 'bootstrap/dist/css/bootstrap.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './index.css';

const persistedState = loadState('state-core-care');
const store = configureStore(persistedState || initialState);

// set Axios default header for accepting JSON
axios.defaults.headers.common['Accept'] = 'application/json';

// throttle ensures that we never write to
// localstorage more than once per second
store.subscribe(
  throttle(() => {
    saveState(
      {
        user: store.getState().user,
        redirect: store.getState().redirect
      },
      'state-core-care'
    );
  }, 1000)
);

// const Loading = () => <h3>Loading</h3>;
// const ErrorPage = (error: any) => <h3>Error: {error}</h3>;
const NoMatch = ({ location }: any) => {
  console.error(`no match for route: ${location.pathname}`);
  return (
    <h3>
      <code>{location.pathname}</code> does not exist
    </h3>
  );
};

// TODO if an API call is unauthenticated redirect to the login page

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
        isFullyAuthenticated(store.getState().user) ? (
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
};

runWithAdal(
  authContext,
  () => {
    ReactDOM.render(
      <Provider store={store}>
        <Router>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/signup" component={SignUpDirect} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/queue" component={TwoPaneLayout} />
              <PrivateRoute path="/users" component={TwoPaneLayout} />
              <Route component={NoMatch} />
            </Switch>
            <ReduxToastr position={'top-right'} />
          </div>
        </Router>
      </Provider>,
      document.getElementById('root') as HTMLElement
    );
  },
  true
);
registerServiceWorker();
