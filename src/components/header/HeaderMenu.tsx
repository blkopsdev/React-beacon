/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { InitialState, Iuser } from '../../models';
import { userLogout } from '../../actions/userActions';
import { isFullyAuthenticated } from '../../actions/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

interface Iprops extends React.Props<Header> {
  user: Iuser;
  userLogout: any;
  loading: boolean;
}

class Header extends React.Component<Iprops, {}> {
  constructor(props: Iprops) {
    super(props);
  }

  render() {
    if (!isFullyAuthenticated(this.props.user)) {
      return null;
    }

    return (
      <span>
        {this.props.loading && (
          <div className="spinner">
            <div className="double-bounce1" />
            <div className="double-bounce2" />
          </div>
        )}

        <span className="profile">
          WELCOME&nbsp;
          <span className="name">{this.props.user.first}</span>
          <span className="vertical" />
          <Button
            bsStyle="link"
            onClick={this.props.userLogout}
            className="header-settings"
          >
            <FontAwesomeIcon icon={['far', 'cog']} size="lg" />
          </Button>
        </span>
      </span>
    );
  }
}

const mapStateToProps = (state: InitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default connect(
  mapStateToProps,
  { userLogout }
)(Header);
