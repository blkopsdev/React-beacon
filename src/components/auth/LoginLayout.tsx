import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { InitialState, Iuser, Iredirect } from '../../models';
import { userLogin, userLogout } from '../../actions/userActions';
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
  userLogout?: any;
  setLoginRedirect?: any;
  setRedirectPathname?: any;
  removeLoginRedirect?: any;
  user?: Iuser;
  redirect: Iredirect;
}

class LoginLayout extends React.Component<Iprops, any> {
  constructor(props: Iprops) {
    super(props);

    this.login = this.login.bind(this);
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
      // setTimeout(() =>{
      this.props.userLogin().then(() => {
        console.log('logged in');

        // this.setState({ redirectToReferrer: true });
        // this.props.history.push('/dashboard');
      });
      // }, 20000)
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

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <Grid>
          <Row>
            <Col>
              <Button bsStyle="default" onClick={this.props.userLogout}>
                Logout
              </Button>
              <Button bsStyle="default" onClick={this.login}>
                Login With to app
              </Button>
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
      userLogout,
      setLoginRedirect,
      removeLoginRedirect,
      setRedirectPathname
    }
  )(LoginLayout)
);
