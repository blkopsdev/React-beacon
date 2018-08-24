import * as React from 'react';
import { connect } from 'react-redux';
import { IinitialState, Iuser } from '../../models';
import Masonry, { MasonryOptions } from 'react-masonry-component';
import { Link } from 'react-router-dom';
import constants from '../../constants/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { translate, TranslationFunction, I18n } from 'react-i18next';

const masonryOptions: MasonryOptions = {
  transitionDuration: 0
};

const { tiles } = constants;

interface Iprops extends React.Props<Dashboard> {
  history: History;
  user: Iuser;
  t: TranslationFunction;
  i18n: I18n;
}
// interface Istate {
// }

class Dashboard extends React.Component<Iprops, {}> {
  constructor(props: Iprops) {
    super(props);
  }

  render() {
    const availableTiles = tiles.filter((tile: any) => {
      return constants.hasSecurityFunction(
        this.props.user,
        tile.securityFunction
      );
    });
    const tileElements = availableTiles.map((tile: any) => {
      const styles = {
        width: tile.width,
        height: tile.height
      };
      return (
        <div key={tile.icon}>
          <Link to={tile.url}>
            <div className={`tile ${tile.color}`} style={styles}>
              <img src={tile.src} />
              <span className="title">
                <FontAwesomeIcon icon={tile.icon} />
                {this.props.t(tile.title)}
              </span>
            </div>
          </Link>
        </div>
      );
    });
    console.log('dashboard render', tileElements);
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

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user
  };
};
export default translate('tiles')(
  connect(
    mapStateToProps,
    {}
  )(Dashboard)
);
