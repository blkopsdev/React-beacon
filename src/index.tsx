import 'bootstrap/dist/css/bootstrap.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import LoginLayout from './components/auth/LoginLayout';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// TODO replace with actual dashboard
const Dashboard = () => <h3>Dashboard</h3>;

const NoMatch = ({ location } : any) => {
  console.error(`no match for route: ${location.pathname}` );
  return ( <h3><code>{location.pathname}</code> does not exist</h3>);
};

// TODO get the user object from Redux and check if they are authenticated
const fakeAuth = {isAuthenticated: false};

const PrivateRoute = ({ component: Component, ...rest } : any) => (
  <Route
    {...rest}
    render={ (props : any) =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

ReactDOM.render(
    <Router>
      <div>
        <p> temp header </p>
        <Switch>
          <Route exact path="/" component={LoginLayout} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
