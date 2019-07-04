import * as React from 'react';
import {
  msalApp,
  requiresInteraction,
  isIE,
  GRAPH_REQUESTS
} from './auth-utils';
import { AuthenticationParameters, Account, AuthError } from 'msal';

// If you support IE, our recommendation is that you sign-in using Redirect APIs
const useRedirectFlow = isIE();

interface Istate {
  account: Account | null;
  error: AuthError | null;
}
interface Iprops {
  account: Account | null;
  error: AuthError | null;
  onSignIn: (redirect: boolean) => Promise<any>;
  onSignOut: () => void;
}

export default class AuthProvider extends React.Component<Iprops, Istate> {
  constructor(props: any) {
    super(props);

    this.state = {
      account: null,
      error: null
      // emailMessages: null,
      // graphProfile: null
    };
  }

  async acquireToken(request: AuthenticationParameters, redirect?: boolean) {
    return msalApp.acquireTokenSilent(request).catch((error: any) => {
      // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
      // due to consent or interaction required ONLY
      if (requiresInteraction(error.errorCode)) {
        return redirect
          ? msalApp.acquireTokenRedirect(request)
          : msalApp.acquireTokenPopup(request);
      }
    });
  }

  async onSignIn(redirect: boolean) {
    if (redirect) {
      return msalApp.loginRedirect(GRAPH_REQUESTS.LOGIN);
    }

    const loginResponse = await msalApp
      .loginPopup(GRAPH_REQUESTS.LOGIN)
      .catch((error: any) => {
        this.setState({
          error: error.message
        });
      });

    if (loginResponse) {
      this.setState({
        account: loginResponse.account,
        error: null
      });
    }
  }

  onSignOut() {
    msalApp.logout();
  }

  async componentDidMount() {
    msalApp.handleRedirectCallback((error: any) => {
      if (error) {
        // This currently doesn't work,
        // as the component mounts multiple times
        // and state gets lost.
        // this.setState({
        //     error: "Unable to acquire access token."
        // });
      }
    });

    const account = msalApp.getAccount();

    this.setState({
      account
    });

    if (account) {
      console.log(account);
    }
  }

  render() {
    return (
      <AuthProvider
        {...this.props}
        account={this.state.account}
        error={this.state.error}
        // graphProfile={this.state.graphProfile}
        onSignIn={() => this.onSignIn(useRedirectFlow)}
        onSignOut={() => this.onSignOut()}
      />
    );
  }
}
