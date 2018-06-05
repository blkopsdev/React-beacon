import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { InitialState, Iuser, Iredirect } from '../../models';
import { adalLogin, userLogin, userLogout } from '../../actions/userActions';
import {
  setLoginRedirect,
  removeLoginRedirect,
  setRedirectPathname
} from '../../actions/redirectToReferrerAction';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from 'react-router-dom';
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

class LoginLayout extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);

    this.login = this.login.bind(this);
  }
  componentWillMount() {
    // if there is no username and there is a token, get the user
    if (this.props.user.email.length === 0 && isAuthenticated()) {
      this.props.userLogin();
    }
  }
  componentDidMount() {
    // store the referring loation in redux
    console.log('this.props.location.state', this.props.location.state);
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    // if (from.pathname !== '/' && isAuthenticated()){
    this.props.setRedirectPathname(from.pathname);
    // }
  }

  login() {
    this.props.setLoginRedirect().then(() => {
      console.log('start adal login');
      this.props.adalLogin();
    });
  }
  render() {
    const { from } = { from: { pathname: this.props.redirect.pathname } } || {
      from: { pathname: '/' }
    };
    const { redirectToReferrer } = this.props.redirect;

    if (redirectToReferrer && isAuthenticated()) {
      this.props.removeLoginRedirect();
      return <Redirect to={from} />;
    }
    if (this.props.user.email.length !== 0 && isAuthenticated()) {
      return <Redirect to={'/dashboard'} />;
    }

    return (
      <div className="loginlayout">
        {/* <p>You must log in to view the page at {from.pathname}</p> */}
        <Grid>
          <Row>
            <Col>
              {/* <Button bsStyle="default" onClick={this.props.userLogout}>
                Logout
              </Button> */}
              <div className="loginForm">
                <span className="loginTitle">Welcome to CatCare!</span>
                <Button
                  bsStyle="default"
                  className="loginBtn"
                  onClick={this.login}
                >
                  <img width="20" height="20" src={azure} /> Login with Meozure
                </Button>
                <Button
                  bsStyle="link"
                  className="signupBtn"
                  // onClick={}
                >
                  Signup
                </Button>
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

export default withRouter(
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
  )(LoginLayout)
);
