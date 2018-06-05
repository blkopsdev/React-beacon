import * as React from 'react';
import { connect } from 'react-redux';
import { InitialState, Iuser } from '../../models';
import { userLogout } from '../../actions/userActions';
import { isAuthenticated } from '../../constants/adalConfig';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faCog from '@fortawesome/fontawesome-free-solid/faCog';

const headerImg = require('src/images/KittenLogo@2x.png');

interface Iprops extends React.Props<Header> {
  userLogout?: any;
}
interface Istate {
  user: Iuser;
}

class Header extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
  }

  getProfile() {
    if (isAuthenticated()) {
      return (
        <span className="profile">
          WELCOME&nbsp;
          <span className="name"> Fluffy</span>
          <span className="vertical" />
          <FontAwesomeIcon
            icon={faCog}
            size="lg"
            onClick={this.props.userLogout}
          />
        </span>
      );
    }
    return '';
  }

  render() {
    return (
      <div className="header">
        <img src={headerImg} />
        {this.getProfile()}
      </div>
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
