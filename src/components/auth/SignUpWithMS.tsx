/*
* signup with existing Microsoft account.  
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { IinitialState, Iuser, Iredirect } from '../../models';
import { adalLogin, userLogin, userLogout } from '../../actions/userActions';
import {
  setLoginRedirect,
  removeLoginRedirect,
  setRedirectPathname
} from '../../actions/redirectToReferrerAction';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import UserForm from './UserForm';

interface Iprops extends RouteComponentProps<{}> {
  userLogin?: any;
  adalLogin?: any;
  userLogout?: any;
  setLoginRedirect?: any;
  setRedirectPathname?: any;
  removeLoginRedirect?: any;
  user: Iuser;
  redirect: Iredirect;
  loading: boolean;
}

const azure = require('../../images/Azure.png');

class SignUpWithMS extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);
  }
  componentWillMount() {
    // if there is no username and there is a token, get the user
    // if (this.props.user.email.length === 0 && isAuthenticated()) {
    //   this.props.userLogin();
    // }
  }
  componentDidMount() {
    this.props.setRedirectPathname('/signupWithMS');
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
    let showSignUpForm: boolean = false;

    // TODO not sure how to update these...
    // if (isFullyAuthenticated(this.props.user)) {
    //   this.props.removeLoginRedirect();
    //   return <Redirect to={'/dashboard'} />;
    // }
    // if (!isFullyAuthenticated(this.props.user) && isAuthenticated()) {
    //   this.props.removeLoginRedirect();
    //   showSignUpForm = true;
    // }
    if (this.props.user.isAuthenticated) {
      this.props.removeLoginRedirect();
      return <Redirect to={'/dashboard'} />;
    }
    if (!this.props.user.isAuthenticated) {
      this.props.removeLoginRedirect();
      showSignUpForm = true;
    }

    return (
      <div className="loginlayout">
        {/* <p>You must log in to view the page at {from.pathname}</p> */}
        <Grid>
          <Row>
            <Col>
              <div className="login-form">
                {showSignUpForm && (
                  <UserForm
                    handleSubmit={this.login}
                    handleCancel={this.login}
                    loading={this.props.loading}
                  />
                )}
                {!showSignUpForm && (
                  <div>
                    <span className="loginTitle">Sign Up to CatCare!</span>
                    <Button
                      bsStyle="default"
                      className="loginBtn"
                      onClick={this.login}
                    >
                      <img width="20" height="20" src={azure} /> Sign Up with
                      Meozure
                    </Button>
                  </div>
                )}
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
)(SignUpWithMS);
