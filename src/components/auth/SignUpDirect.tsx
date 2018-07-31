/*
* Signup directly (no existing Microsoft account)
*/
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { InitialState, Iuser, Iredirect } from '../../models';
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
import { Col, Grid, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { isAuthenticated } from '../../constants/adalConfig';
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
}
interface Istate {
  redirectToLogin: boolean;
}

class SignUpDirect extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      redirectToLogin: false
    };
    this.cancel = this.cancel.bind(this);
  }

  cancel() {
    this.setState({ redirectToLogin: true });
  }
  render() {
    if (this.props.user.email.length && isAuthenticated()) {
      this.props.removeLoginRedirect();
      return <Redirect to={'/dashboard'} />;
    }
    if (this.state.redirectToLogin) {
      return <Redirect to={'/'} />;
    }

    return (
      <div className="loginlayout">
        <Grid>
          <Row>
            <Col>
              <div className="loginForm">
                <UserForm
                  handleSubmit={this.props.signUpDirect}
                  handleCancel={this.cancel}
                />
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
    setRedirectPathname,
    signUpDirect
  }
)(SignUpDirect);
