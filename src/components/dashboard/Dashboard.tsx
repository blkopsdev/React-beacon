import * as React from 'react';
import { connect } from 'react-redux';
import { InitialState, Iuser } from '../../models';
import Masonry from 'react-masonry-component';
import { Link } from 'react-router-dom';
import constants from '../../constants/constants';

const masonryOptions = {
  transitionDuration: 0
};

const { tiles } = constants;

const iconImg = require('src/images/Training Icon@2x.png');

interface Iprops extends React.Props<Dashboard> {
  history: History;
  user: Iuser;
}
// interface Istate {
// }

class Dashboard extends React.Component<Iprops, {}> {
  constructor(props: Iprops) {
    super(props);
  }

  render() {
    const tileElements = tiles.map((tile: any) => {
      const shouldDisplay = constants.securityFunctions.hasSecurityFunction(
        this.props.user,
        tile.securityFunction
      );
      const styles = {
        width: tile.width,
        height: tile.height,
        display: shouldDisplay ? 'block' : 'none'
      };
      return (
        <div key={tile.icon}>
          <Link to={tile.url}>
            <div className={tile.class} style={styles}>
              <img src={tile.src} />
              <span className="title">
                <img src={iconImg} />
                {tile.title}
              </span>
            </div>
          </Link>
        </div>
      );
    });

    return (
      <Masonry
        className={'dashboard'} // default ''
        elementType={'div'} // default 'div'
        options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
      >
        {tileElements}
      </Masonry>
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
)(Dashboard);
