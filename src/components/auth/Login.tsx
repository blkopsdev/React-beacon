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
import {
  adalLogin,
  userLogin,
  userLogout,
  authContext
} from '../../actions/userActions';
import {
  setLoginRedirect,
  removeLoginRedirect,
  setRedirectPathname
} from '../../actions/redirectToReferrerAction';

// const Loading = () => <h3>Loading...</h3>;

interface Iprops extends RouteComponentProps<{}> {
  userLogin?: any;
  adalLogin?: any;
  userLogout?: any;
  setLoginRedirect?: any;
  setRedirectPathname?: any;
  removeLoginRedirect?: any;
  user: Iuser;
  redirect: Iredirect;
  t: TranslationFunction;
  i18n: I18n;
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
    const { from } = this.props.location.state || {
      from: { pathname: '/dashboard' }
    };
    /*
    * If we have a Azure AD token, then set it.  If we have a token, but the user is not authenticated, then use the token to login to the API
    */

    if (authContext.getAccount()) {
      // setCachedToken();
      if (!this.props.user.isAuthenticated) {
        this.props
          .userLogin()
          .then(() => {
            this.props.history.push(from.pathname);
          })
          .catch(() => {
            console.error('login failed in login.tsx');
            this.setState({ userLoginFailed: true });
          });
      } else {
        // user is authenticated, so take them back to where they came from or to the default route
        this.props.history.push(from.pathname);
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

    // TODO show a toast message if this.props.redirect.pathname does not equal "/"
    // <p>You must log in to view the page at {from.pathname}</p>
  }

  login = () => {
    this.props
      .setLoginRedirect()
      .then(() => {
        console.log('start adal login');
        this.props.adalLogin();
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

    // if the user is authenticated but not fully, show loading
    // if (checkCachedToken()) {
    //   return <Loading />;
    // }

    // if user is authenticated and exists in the backend
    // redirect to the redirect.pathname or the dashboard
    if (this.props.user.isAuthenticated) {
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
                >
                  <img width="20" height="20" src={azure} />
                  {t('loginButton')}
                </Button>
                <LinkContainer to={'/signup'}>
                  <Button bsStyle="link" className="signupBtn" bsSize="large">
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
    redirect: state.redirect
  };
};

export default translate('auth')(
  connect(
    mapStateToProps,
    {
      userLogin,
      adalLogin,
      userLogout,
      setLoginRedirect,
      removeLoginRedirect,
      setRedirectPathname
    }
  )(Login)
);
