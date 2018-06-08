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
import { runWithAdal } from 'react-adal';
import axios from 'axios';
import { authContext, isAuthenticated } from './constants/adalConfig';
import Dashboard from './components/dashboard/Dashboard';
import Header from './components/header/Header';
import LoginSuccess from './components/auth/LoginSuccess';
import SignUp from './components/auth/SignUp';

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

// every time we want to go to a protected route call adalGetToken.  if it fails then redirect to login page.  when they hit the login button.  call authContext.login();
// if an API call is unauthenticated redirect to the login page

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
        store.getState().user.email.length && isAuthenticated() ? (
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

const testme = () => {
  return <h3>Your test is a success</h3>;
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
              <Route exact path="/" component={LoginSuccess} />
              <Route exact path="/login" component={LoginLayout} />
              <Route exact path="/signup" component={SignUp} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/testing" component={testme} />
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
