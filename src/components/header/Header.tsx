import * as React from 'react';
import { connect } from 'react-redux';
import { InitialState, Iuser } from '../../models';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faCog from '@fortawesome/fontawesome-free-solid/faCog';

const headerImg = require('src/images/KittenLogo@2x.png');

interface Iprops extends React.Props<Header> {}
interface Istate {
  user: Iuser;
}

class Header extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <img src={headerImg} />
        <span className="profile">
          WELCOME&nbsp;
          <span className="name"> Fluffy</span>
          <span className="vertical" />
          <FontAwesomeIcon icon={faCog} size="lg" />
        </span>
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
  {}
)(Header);
