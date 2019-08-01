import * as React from 'react';
import { connect } from 'react-redux';
import { IinitialState, Iuser } from '../../models';
import Masonry, { MasonryOptions } from 'react-masonry-component';
import { Link } from 'react-router-dom';
import { constants } from '../../constants/constants';
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
  render() {
    const availableTiles = tiles.filter(tile => {
      return constants.hasSecurityFunction(
        this.props.user,
        tile.securityFunction
      );
    });
    const tileElements = availableTiles.map(tile => {
      const styles = {
        width: tile.width,
        height: tile.height
      };
      return (
        <div key={tile.title}>
          <Link to={tile.url}>
            <div className={`tile ${tile.color}`} style={styles}>
              <img src={tile.src} style={styles} alt="" />
              <span className="title">
                {tile.faIcon !== undefined && (
                  <FontAwesomeIcon icon={tile.faIcon} />
                )}
                {tile.imgIcon !== undefined && (
                  <span>
                    <img
                      src={tile.imgIcon}
                      width={40}
                      height={40}
                      style={{ opacity: 100, marginBottom: 10 }}
                      alt=""
                    />
                    <br />
                  </span>
                )}
                {this.props.t(tile.title)}
              </span>
            </div>
          </Link>
        </div>
      );
    });
    return (
      <div>
        <div className="dashboard-background" />
        <Masonry
          className={'dashboard'} // default ''
          elementType={'div'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {tileElements}
        </Masonry>
      </div>
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
