import * as React from 'react';
import { connect } from 'react-redux';
// import { Redirect, Link } from 'react-router-dom';
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
// import { isAuthenticated } from '../../constants/adalConfig';

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

class LoginLayout extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);
    this.login = this.login.bind(this);
  }
  // componentWillMount() {
  // if there is no username and there is a token, get the user
  // if (!this.props.user.email.length  && isAuthenticated()) {
  //   this.props.userLogin();
  // }
  // }
  componentDidMount() {
    // store the referring loation in redux, we will need it when the user returns from
    // logging into Azure which will redirect the user to /LoginSuccess
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (from.pathname !== '/') {
      this.props.setRedirectPathname(from.pathname);
    }

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
    // if we have a user and they are authenticated take them to the dashboard
    // if (this.props.user.email.length && isAuthenticated()) {
    //   return <Redirect to={'/dashboard'} />;
    // }

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
)(LoginLayout);
