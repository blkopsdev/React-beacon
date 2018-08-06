/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
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
      <span className="profile">
        WELCOME&nbsp;
        <span className="name"> Fluffy</span>
        <span className="vertical" />
        <Button
          bsStyle="link"
          onClick={this.props.userLogout}
          className="header-settings"
        >
          <FontAwesomeIcon icon="cog" size="lg" />
        </Button>
      </span>
    );
  }
}

const mapStateToProps = (state: InitialState, ownProps: Iprops) => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  { userLogout }
)(Header);
