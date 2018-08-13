/*
* Signup directly (no existing Microsoft account)
*/
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { InitialState, Iuser, Iredirect, ItempUser } from '../../models';
import {
  adalLogin,
  userLogin,
  userLogout,
  signUpDirect
} from '../../actions/userActions';
import {
  setLoginRedirect,
  removeLoginRedirect,
  setRedirectPathname
} from '../../actions/redirectToReferrerAction';
import { Col, Grid, Row, Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { isFullyAuthenticated } from '../../actions/userActions';
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
  signUpDirect: any;
  loading: boolean;
}
interface Istate {
  redirectToLogin: boolean;
  showSignupSuccess: boolean;
}

const SignUpSuccess = (props: any) => {
  return (
    <div className="loginForm signup-success" style={{ color: 'white' }}>
      <h2> Success! </h2>
      <p>
        You have been successfully added into the system. An BeaconMedaes admin
        will review your application and be in touch with you soon.{' '}
      </p>
      <p>
        Please make sure that <br /> no-reply@beaconmedaes.com is cleared so
        that it does not end up in your spam.
      </p>
      <Button
        bsStyle="link"
        className="pull-right ok-button"
        style={{ color: 'white', margin: '12px' }}
        onClick={props.handleCancel}
      >
        Ok
      </Button>
    </div>
  );
};

class SignUpDirect extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      redirectToLogin: false,
      showSignupSuccess: false
    };
    this.cancel = this.cancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  cancel() {
    this.setState({ redirectToLogin: true });
  }
  handleSubmit(newUser: ItempUser) {
    return this.props.signUpDirect(newUser).then(() => {
      this.setState({ showSignupSuccess: true });
    });
  }
  render() {
    if (isFullyAuthenticated(this.props.user)) {
      this.props.removeLoginRedirect();
      return <Redirect to={'/dashboard'} />;
    }
    if (this.state.redirectToLogin) {
      return <Redirect to={'/'} />;
    }
    const flipClass = this.state.showSignupSuccess
      ? 'flip-container flip'
      : 'flip-container';
    return (
      <div className="loginlayout signup">
        <Grid>
          <Row>
            <Col>
              <div className={flipClass}>
                <div className="flipper">
                  <div className="front">
                    <UserForm
                      handleSubmit={this.handleSubmit}
                      handleCancel={this.cancel}
                      loading={this.props.loading}
                    />
                  </div>
                  <div className="back">
                    <SignUpSuccess handleCancel={this.cancel} />
                  </div>
                </div>
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
    setRedirectPathname,
    signUpDirect
  }
)(SignUpDirect);
