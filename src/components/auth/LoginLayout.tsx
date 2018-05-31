import * as React from "react";
import {
  Redirect,
} from "react-router-dom";
import LoginForm from './LoginForm';

interface Iprops extends React.Props<LoginLayout> {
  location: any
}
interface Istate {
  redirectToReferrer: boolean;
}
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb : any) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb : any) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

class LoginLayout extends React.Component <Iprops, Istate >{
  state : Istate = {
    redirectToReferrer: false
  };

  // TODO move this login into the LoginForm component
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <LoginForm />
        {/*<button onClick={this.login}>Log in</button>*/}
      </div>
    );
  }

}

export default LoginLayout;