/*
* This component handles a successful login into Azure
* If it is an existing user, route to the dashboard or whatever private route they were trying to access before
* being redirected to the login screen.
* If it is a new user, route to the signup page
* 
*/

import * as React from 'react';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import { InitialState, Iuser, Iredirect } from '../../models';
import { adalLogin, userLogin, userLogout } from '../../actions/userActions';
import {
  setLoginRedirect,
  removeLoginRedirect,
  setRedirectPathname
} from '../../actions/redirectToReferrerAction';
import { Grid } from 'react-bootstrap';
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

class LoginSuccess extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);
  }
  // componentWillMount() {
  // if there is no username and there is a token and they did NOT just signup, get the user
  // const { from } = this.props.location.state || { from: { pathname: '/' } };
  // if (
  //   !this.props.user.email.length &&
  //   isAuthenticated() &&
  //   from.pathname !== '/signup'
  // ) {
  //   this.props.userLogin();
  // }
  // }
  // componentDidMount() {

  // }

  render() {
    // handle potential redirects
    // const { from } = { from: { pathname: this.props.redirect.pathname } } || {
    //   from: { pathname: '/' }
    // };
    // const { redirectToReferrer } = this.props.redirect;

    // if user is authenticated and exists in the backend
    // redirect to the redirect.pathname or the dashboard
    // if (isAuthenticated()) {

    //   const protectedPath: string = redirectToReferrer
    //     ? from.pathname
    //     : '/dashboard';

    //     console.log('redirecting!!!', protectedPath)
    //     this.props.removeLoginRedirect();
    //   return <Redirect to={protectedPath} />;
    // }

    return (
      <div className="LoginSuccess">
        {/* <p>You must log in to view the page at {from.pathname}</p> */}
        <Grid>
          <p> login success </p>
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
)(LoginSuccess);
