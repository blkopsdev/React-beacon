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

class SignUpDirect extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);

    this.signup = this.signup.bind(this);
  }
  componentWillMount() {
    // if there is no username and there is a token, get the user
    // if (this.props.user.email.length === 0 && isAuthenticated()) {
    //   this.props.userLogin();
    // }
  }
  componentDidMount() {
    this.props.setRedirectPathname('/signup');
  }

  signup(newUser: ItempUser) {
    this.props.signUpDirect(newUser);

    // this.props.setLoginRedirect().then(() => {
    //   console.log('start adal login');
    //   this.props.adalLogin();
    // });
  }
  render() {
    if (this.props.user.email.length && isAuthenticated()) {
      this.props.removeLoginRedirect();
      return <Redirect to={'/dashboard'} />;
    }
    return (
      <div className="loginlayout">
        {/* <p>You must log in to view the page at {from.pathname}</p> */}
        <Grid>
          <Row>
            <Col>
              <div className="loginForm">
                <UserForm handleSubmit={this.signup} />
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
