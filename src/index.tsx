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
  faEdit,
  faSortAmountUp,
  faSortAmountDown,
  faClipboardList,
  faWrench,
  faHistory
} from '@fortawesome/pro-regular-svg-icons';
import {
  faUsers,
  faSearch,
  faUser,
  faShoppingCart,
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReduxToastr from 'react-redux-toastr';
import axios from 'axios';

import Login from './components/auth/Login';
import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { PersistGate } from 'redux-persist/integration/react';
import { TrackJS } from 'trackjs';

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
  faWrench,
  faListAlt,
  faPlus,
  faMinus,
  faClock,
  faEdit,
  faSortAmountUp,
  faSortAmountDown,
  faClipboardList,
  faHistory
);

import { authContext } from './actions/userActions';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/header/Header';
import SignUpDirect from './components/auth/SignUpDirect';
import TwoPaneLayout from './components/common/TwoPaneLayout';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

// import project css
import 'react-toggle/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';

// import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.css';
import { constants } from './constants/constants';

const { store, persistor } = configureStore();

// set Axios default header for accepting JSON
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = constants.httpTimeout;

// Trackjs

TrackJS.install({
  token: '7acefdd92da44ad595db60cb7c09af8c',
  application: 'mymedgas',
  version: process.env.REACT_APP_VERSION,
  enabled: !(window.location.host.indexOf('localhost') >= 0)
  // for more configuration options, see https://docs.trackjs.com
});

// set the window name for UTA transaction window
window.name = 'MyMedGas';

/*
* flush writes the current state to storage - this will be right after USER_LOGOUT_SUCCESS is triggered
in userActions.  then we pause the persistor in order to prevent anything else from being persisted while we logout.
*/
const handleLogout = () => {
  persistor.flush().then(() => {
    persistor.pause();
    authContext.logout();
  });
};
document.addEventListener('userLogout', handleLogout, false);

// const Loading = () => <h3>Loading</h3>;
// const ErrorPage = (error: any) => <h3>Error: {error}</h3>;
const NoMatch = ({ location }: any) => {
  console.error(`no match for route: ${location.pathname}`);
  return (
    <div>
      <h3>
        <code>{location.pathname}</code> does not exist
      </h3>
      <LinkContainer to="/">
        <Button bsStyle="link">Back to home page.</Button>
      </LinkContainer>
    </div>
  );
};

// TODO if an API call is unauthenticated redirect to the login page

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const user = store.getState().user;
  let authenticated = false;
  authenticated = user.isAuthenticated && user.id.length > 0;
  if (authenticated) {
    // setCachedToken();
    TrackJS.configure({
      userId: user.email,
      version: process.env.REACT_APP_VERSION
    });
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

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="main-body-content">
            <Header />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/signup" component={SignUpDirect} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/queue" component={TwoPaneLayout} />
              <PrivateRoute path="/users" component={TwoPaneLayout} />
              <PrivateRoute path="/team" component={TwoPaneLayout} />
              <PrivateRoute path="/inventory" component={TwoPaneLayout} />
              <PrivateRoute path="/brands" component={TwoPaneLayout} />
              <PrivateRoute
                path="/customer-and-facility"
                component={TwoPaneLayout}
              />
              <PrivateRoute path="/alerts" component={TwoPaneLayout} />
              <PrivateRoute path="/productqueue" component={TwoPaneLayout} />
              <PrivateRoute path="/managejobs" component={TwoPaneLayout} />
              <PrivateRoute path="/reports" component={TwoPaneLayout} />
              <PrivateRoute path="/locations" component={TwoPaneLayout} />
              <PrivateRoute path="/training" component={TwoPaneLayout} />
              <PrivateRoute path="/manageTraining" component={TwoPaneLayout} />
              <PrivateRoute path="/measurements" component={TwoPaneLayout} />
              <PrivateRoute
                path="/customermeasurements"
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
      </PersistGate>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
