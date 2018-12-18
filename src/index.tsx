/*
* Index is the entry point for the app. 
* Initial routes are here and secondary routes are in TwoPanelLayout
*/

import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import {
  faCog,
  faCalendarCheck,
  faTh,
  faCheck,
  faTimes,
  faPlus,
  faMinus,
  faHospital,
  faSignOut,
  faListAlt,
  faClock,
  faEdit
} from '@fortawesome/pro-regular-svg-icons';
import {
  faUsers,
  faSearch,
  faUser,
  faShoppingCart,
  faChevronDown,
  faChevronRight,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { runWithAdal } from 'react-adal';
import { throttle } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReduxToastr from 'react-redux-toastr';
import axios from 'axios';

import { loadState, saveState } from './store/localStorage';
import { setCachedToken } from './actions/userActions';
import Login from './components/auth/Login';
import configureStore from './store/configureStore';
import initialState from './reducers/initialState';
import registerServiceWorker from './registerServiceWorker';

library.add(
  faCog,
  faUsers,
  faCalendarCheck,
  faTh,
  faCheck,
  faTimes,
  faSearch,
  faHospital,
  faUser,
  faSignOut,
  faShoppingCart,
  faChevronDown,
  faChevronRight,
  faEnvelope,
  faListAlt,
  faPlus,
  faMinus,
  faClock,
  faEdit
);

import { authContext } from './actions/userActions';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/header/Header';
import SignUpDirect from './components/auth/SignUpDirect';
import TwoPaneLayout from './components/common/TwoPaneLayout';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import { Iuser } from './models';
import * as types from './actions/actionTypes';

// import project css
import 'react-toggle/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-datetime/css/react-datetime.css';
import './index.css';

const persistedState = loadState('state-core-care');
const store = configureStore(persistedState || initialState);

// set Axios default header for accepting JSON
axios.defaults.headers.common['Accept'] = 'application/json';

// set the window name for UTA transaction window
window.name = 'MyMedGas';

// throttle ensures that we never write to
// localstorage more than once per second
store.subscribe(
  throttle(() => {
    saveState(
      {
        user: store.getState().user,
        redirect: store.getState().redirect,
        manageUserQueue: store.getState().manageUserQueue,
        customers: store.getState().customers,
        manageUser: store.getState().manageUser,
        manageTeam: store.getState().manageTeam,
        manageInventory: store.getState().manageInventory,
        productInfo: store.getState().productInfo,
        training: store.getState().training,
        manageTraining: store.getState().manageTraining
        // facilities: store.getState().facilities
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
/*
  * Check the app version.  If it has changed, log the user out.  
  * This helps avoid breaking changes in the Redux store
  * if we wanted to improve this we could choose to not to log the user out on incremental "." updates
  * Also we might figure out a way to move this to the userActions
  */
const checkAppVersion = (user: Iuser) => {
  if (user.appVersion && user.appVersion === process.env.REACT_APP_VERSION) {
    console.log('app is up to date:', process.env.REACT_APP_VERSION);
  } else {
    store.dispatch({
      type: types.USER_LOGOUT_SUCCESS
    });
    localStorage.removeItem('state-core-care');
    setTimeout(() => {
      authContext.logOut();
    }, 100); // give it time to persist this to local storage
    console.error(
      `App has been updated from: ${user.appVersion} to: ${
        process.env.REACT_APP_VERSION
      }, logging out`
    );
  }
};

// TODO if an API call is unauthenticated redirect to the login page

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const user = store.getState().user;
  let authenticated = false;
  authenticated = user.isAuthenticated && user.id.length > 0;
  if (authenticated) {
    // if authenticated, set the Azure token to the HTTP headers
    setCachedToken();
    checkAppVersion(user);
  }
  return (
    <Route
      {...rest}
      render={(props: any) =>
        authenticated ? (
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
      <I18nextProvider i18n={i18n}>
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
                <PrivateRoute path="/team" component={TwoPaneLayout} />
                <PrivateRoute path="/inventory" component={TwoPaneLayout} />
                <PrivateRoute path="/productqueue" component={TwoPaneLayout} />
                <PrivateRoute path="/managejobs" component={TwoPaneLayout} />
                <PrivateRoute path="/locations" component={TwoPaneLayout} />
                <PrivateRoute path="/training" component={TwoPaneLayout} />
                <PrivateRoute
                  path="/manageTraining"
                  component={TwoPaneLayout}
                />

                <Route component={NoMatch} />
              </Switch>
              <ReduxToastr
                position={'top-right'}
                preventDuplicates={process.env.NODE_ENV === 'production'}
              />
            </div>
          </Router>
        </Provider>
      </I18nextProvider>,
      document.getElementById('root') as HTMLElement
    );
  },
  true
);
registerServiceWorker();
