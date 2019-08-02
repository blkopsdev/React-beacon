/*
* This component has 2 primary responsibilities
* 1)  a successful login into Azure
* If it is an existing user, route to the dashboard or whatever private route they were trying to access before
* being redirected to the login screen.
* If it is a new user, route to the signup page
* 2) provide a plane for the user to begin logging in
*/

import { Button, Col, Grid, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { IinitialState, Iuser, Iredirect } from '../../models';
import { MSALlogin, userLogin, userLogout } from '../../actions/userActions';
import {
  setLoginRedirect,
  removeLoginRedirect,
  setRedirectPathname
} from '../../actions/redirectToReferrerAction';
import { msalApp } from './Auth-Utils';
// const Loading = () => <h3>Loading...</h3>;

interface Iprops extends RouteComponentProps<{}> {
  userLogin: () => any;
  MSALlogin: typeof MSALlogin;
  userLogout: typeof userLogout;
  setLoginRedirect: () => Promise<void>;
  setRedirectPathname: typeof setRedirectPathname;
  removeLoginRedirect: typeof removeLoginRedirect;
  user: Iuser;
  redirect: Iredirect;
  t: TranslationFunction;
  i18n: I18n;
  loading: boolean;
}
interface Istate {
  userLoginFailed: boolean;
}

const azure = require('../../images/Azure.png');

class Login extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);

    this.state = {
      userLoginFailed: false
    };
  }
  componentWillMount() {
    document.addEventListener(
      'missingUser',
      this.handleRedirectToSignup,
      false
    );

    if (msalApp.getAccount()) {
      if (!this.props.user.isAuthenticated) {
        this.props
          .userLogin()
          .then()
          .catch(() => {
            console.error('login failed in login.tsx');
            this.setState({ userLoginFailed: true });
          });
      } else {
        console.log(
          'user is fully authenticated and the login component mounted'
        );
      }
    } else {
      console.log('the token is invalid');
      if (this.props.user.isAuthenticated) {
        console.error('token is expired but user is authenticated');
      }
    }
  }
  componentDidMount() {
    // store the referring loation in redux
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    // if we are not already redirecting, then set it
    if (!this.props.redirect.redirectToReferrer) {
      this.props.setRedirectPathname(from.pathname);
    }
  }

  handleRedirectToSignup = () => {
    this.props.history.push('/social_signup');
  };

  /*
  * Login
  * set loginRedirect to true so that it will redirect where the user was trying to go if anywhere
  * when this returns from the MSAL redirect
  */
  login = () => {
    this.props
      .setLoginRedirect()
      .then(() => {
        console.log('start adal login');
        this.props.MSALlogin();
      })
      .catch((error: any) => console.error(error));
  };
  render() {
    const { t } = this.props;
    // handle potential redirects
    const { from } = { from: { pathname: this.props.redirect.pathname } } || {
      from: { pathname: '/' }
    };
    const { redirectToReferrer } = this.props.redirect;

    // if user is authenticated and exists in the backend
    // redirect to the redirect.pathname or the dashboard
    if (msalApp.getAccount() && this.props.user.isAuthenticated) {
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
              <div className="login-form login">
                <span className="loginTitle">{t('welcome')}</span>
                <Button
                  bsStyle="default"
                  className="loginBtn"
                  onClick={this.login}
                  disabled={this.props.loading}
                >
                  <img width="20" height="20" src={azure} alt="icon" />
                  {t('loginButton')}
                </Button>
                <LinkContainer to={'/signup'}>
                  <Button
                    bsStyle="link"
                    className="signupBtn"
                    bsSize="large"
                    disabled={this.props.loading}
                  >
                    {t('signUp')}
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
const mapStateToProps = (state: IinitialState, ownProps: any) => {
  return {
    user: state.user,
    redirect: state.redirect,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default translate('auth')(
  connect(
    mapStateToProps,
    {
      userLogin,
      MSALlogin,
      userLogout,
      setLoginRedirect,
      removeLoginRedirect,
      setRedirectPathname
    }
  )(Login)
);
