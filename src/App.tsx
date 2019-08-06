import * as React from 'react';
import { connect } from 'react-redux';
import { IinitialState, Iuser } from './models';
import Header from './components/header/Header';
import TwoPaneLayout from './components/common/TwoPaneLayout';

import Login from './components/auth/Login';
import ReduxToastr, { toastr } from 'react-redux-toastr';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { constants } from './constants/constants';
import { TrackJS } from 'trackjs';
import SignUpDirect from './components/auth/SignUpDirect';
import SignUpWithMS from './components/auth/SignUpWithMS';
import Dashboard from './components/dashboard/Dashboard';
import { setRedirectPathname } from './actions/redirectToReferrerAction';
import { throttle } from 'lodash';

// import * as moment from 'moment';
window.addEventListener('beforeinstallprompt', e => {
  console.log('install prompt triggered');
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  // e.preventDefault();
  // // Stash the event so it can be triggered later.
  // deferredPrompt = e;
});
// import 'moment/locale/de'
// moment.locale('de')

// const ErrorPage = (error: any) => <h3>Error: {error}</h3>;
const NoMatch = ({ location }: any) => {
  console.error(`no match for route: ${location.pathname}`);
  return (
    <h3 style={{ padding: '20px' }}>
      <code>{location.pathname}</code> does not exist
    </h3>
  );
};

interface Props extends React.Props<App> {
  user: Iuser;
  setRedirectPathname: typeof setRedirectPathname;
}
interface State {
  fullScreenLoading: boolean;
  redirectToSocialSignup: boolean;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fullScreenLoading: false,
      redirectToSocialSignup: false
    };
    this.handleSetRedirect = throttle(this.handleSetRedirect, 2000);
  }
  componentDidMount() {
    document.addEventListener(
      'missingUser',
      this.handleRedirectToSignup,
      false
    );
    document.addEventListener(
      'newVersionAvailable',
      this.handleNewVersion,
      false
    );
    if (this.props.user.email.length) {
      TrackJS.configure({
        userId: this.props.user.email,
        version: process.env.REACT_APP_VERSION
      });
      console.log('app is loaded and authenticated');
    }
  }

  componentWillUnmount() {
    document.removeEventListener(
      'missingUser',
      this.handleRedirectToSignup,
      false
    );
    document.removeEventListener(
      'newVersionAvailable',
      this.handleNewVersion,
      false
    );
  }
  handleSetRedirect = () => {
    const { pathname } = window.location;
    this.props.setRedirectPathname(pathname, true);
  };
  handleRedirectToSignup = () => {
    this.setState({ redirectToSocialSignup: true }, () => {
      this.setState({ redirectToSocialSignup: false });
    });
  };

  PrivateRoute = ({ component: Component, ...rest }: any) => {
    const { user } = this.props;
    const authenticated =
      // msalApp.getAccount() && user.isAuthenticated && user.id.length > 0;
      user.isAuthenticated && user.id.length > 0; // do not check validity of token here because we do not handle renewing the token when simply navigating to a new route
    if (authenticated) {
      this.handleSetRedirect();
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

  handleNewVersion = () => {
    toastr.warning('Installing Update', 'Please wait...', {
      ...constants.toastrWarning,
      timeOut: 5000
    });
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  render() {
    const { PrivateRoute } = this;
    if (this.state.redirectToSocialSignup) {
      return (
        <Router>
          <Redirect to={'/azure_signup'} />
        </Router>
      );
    }
    return (
      <div className="app">
        {/* <Loading
          show={!this.props.lastSync && this.props.user.isAuthenticated}
          message={'Loading...'}
        /> */}

        <Router>
          <div className="main-body-content">
            <Header />
            <Switch>
              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/signup" component={SignUpDirect} />
                <Route exact path="/azure_signup" component={SignUpWithMS} />
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
                <PrivateRoute
                  path="/manageTraining"
                  component={TwoPaneLayout}
                />
                <PrivateRoute path="/measurements" component={TwoPaneLayout} />
                <PrivateRoute
                  path="/customermeasurements"
                  component={TwoPaneLayout}
                />
                <Route component={NoMatch} />
              </Switch>
            </Switch>
            <ReduxToastr
              position={'top-right'}
              preventDuplicates={process.env.NODE_ENV === 'production'}
            />
          </div>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: any) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default connect(
  mapStateToProps,
  { setRedirectPathname }
)(App);