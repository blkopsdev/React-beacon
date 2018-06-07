/*
* This component handles a successful login into Azure
* If it is an existing user, route to the dashboard
* If it is a new user, route to the signup page
* it is connected to redux so that it can store 
*/

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
import { Grid } from 'react-bootstrap';
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

class LoginSuccess extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);
  }
  componentWillMount() {
    // if there is no username and there is a token and they did NOT just signup, get the user
    if (
      !this.props.user.email.length &&
      isAuthenticated() &&
      this.props.location.state.from.pathname !== '/signup'
    ) {
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

  render() {
    const { from } = { from: { pathname: this.props.redirect.pathname } } || {
      from: { pathname: '/' }
    };
    const { redirectToReferrer } = this.props.redirect;

    //
    // if (redirectToReferrer && isAuthenticated()) {
    //   this.props.removeLoginRedirect();
    //   return <Redirect to={from.pathname} />;
    // }

    // if user is authenticated and exists in the backend
    // redirect to the redirect.pathname or the dashboard
    if (isAuthenticated()) {
      this.props.removeLoginRedirect();
      const protectedPath: string = redirectToReferrer
        ? from.pathname
        : '/dashboard';
      return <Redirect to={protectedPath} />;
    }

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
  )(LoginSuccess)
);
