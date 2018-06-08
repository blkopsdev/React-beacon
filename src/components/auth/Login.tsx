/*
* This component has 2 primary responsibilities
* 1)  a successful login into Azure
* If it is an existing user, route to the dashboard or whatever private route they were trying to access before
* being redirected to the login screen.
* If it is a new user, route to the signup page
* 2) provide a plane for the user to begin logging in
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { InitialState, Iuser, Iredirect } from '../../models';
import { adalLogin, userLogin, userLogout } from '../../actions/userActions';
import {
  setLoginRedirect,
  removeLoginRedirect,
  setRedirectPathname
} from '../../actions/redirectToReferrerAction';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { isAuthenticated } from '../../constants/adalConfig';

interface Iprops extends RouteComponentProps<{}> {
  userLogin?: any;
  adalLogin?: any;
  userLogout?: any;
  setLoginRedirect?: any;
  setRedirectPathname?: any;
  removeLoginRedirect?: any;
  user: Iuser;
  redirect: Iredirect;
}

const azure = require('../../images/Azure.png');

class Login extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);

    this.login = this.login.bind(this);
  }
  componentWillMount() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (
      !this.props.user.email.length &&
      isAuthenticated() &&
      from.pathname !== '/signup'
    ) {
      this.props.userLogin();
    }
  }
  componentDidMount() {
    // store the referring loation in redux
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    this.props.setRedirectPathname(from.pathname);
    // TODO show a toast message if this.props.redirect.pathname does not equal "/"
    // <p>You must log in to view the page at {from.pathname}</p>
  }

  login() {
    this.props.setLoginRedirect().then(() => {
      console.log('start adal login');
      this.props.adalLogin();
    });
  }
  render() {
    // handle potential redirects
    const { from } = { from: { pathname: this.props.redirect.pathname } } || {
      from: { pathname: '/' }
    };
    const { redirectToReferrer } = this.props.redirect;

    // if user is authenticated and exists in the backend
    // redirect to the redirect.pathname or the dashboard
    if (isAuthenticated()) {
      const loggedInPath: string = redirectToReferrer
        ? from.pathname
        : '/dashboard';

      console.log('redirecting!!!', loggedInPath);
      this.props.removeLoginRedirect();
      return <Redirect to={loggedInPath} />;
    }

    return (
      <div className="loginlayout">
        <Grid>
          <Row>
            <Col>
              <div className="loginForm">
                <span className="loginTitle">Welcome to CatCare!</span>
                <Button
                  bsStyle="default"
                  className="loginBtn"
                  onClick={this.login}
                >
                  <img width="20" height="20" src={azure} /> Login with Meozure
                </Button>
                <LinkContainer to={'/signup'}>
                  <Button bsStyle="link" className="signupBtn">
                    Signup
                  </Button>
                </LinkContainer>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
const mapStateToProps = (state: InitialState, ownProps: any) => {
  return {
    user: state.user,
    redirect: state.redirect
  };
};

// export default LoginLayout;

export default connect(
  mapStateToProps,
  {
    userLogin,
    adalLogin,
    userLogout,
    setLoginRedirect,
    removeLoginRedirect,
    setRedirectPathname
  }
)(Login);
