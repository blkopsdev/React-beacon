import * as React from 'react';
import { connect } from 'react-redux';
import { InitialState, Iuser } from '../../models';
import Masonry from 'react-masonry-component';
import { Link } from 'react-router-dom';

const masonryOptions = {
  transitionDuration: 0
};

const tiles: any = [
  {
    icon: 'icon-alerts',
    title: 'Alerts',
    src: 'https://placekitten.com/360/136',
    class: 'tile tile-dark',
    width: 360,
    height: 136,
    url: '/alerts'
  },
  {
    icon: 'icon-training',
    title: 'Training',
    src: 'https://placekitten.com/360/408',
    class: 'tile tile-green',
    width: 360,
    height: 408,
    url: '/training'
  },
  {
    icon: 'icon-maintenance',
    title: 'Maintenance',
    src: 'https://placekitten.com/360/408',
    class: 'tile tile-blue',
    width: 360,
    height: 408,
    url: '/maintenance'
  },
  {
    icon: 'icon-reports',
    title: 'Reports',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-orange',
    width: 360,
    height: 272,
    url: '/reports'
  },
  {
    icon: 'icon-team',
    title: 'Manage Team',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-blue',
    width: 359,
    height: 272,
    url: '/team'
  },
  {
    icon: 'icon-docs',
    title: 'Documents & Legal',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-purple',
    width: 360,
    height: 272,
    url: '/docs'
  },
  {
    icon: 'icon-inventory',
    title: 'Inventory',
    src: 'https://placekitten.com/360/408',
    class: 'tile tile-green',
    width: 360,
    height: 408,
    url: '/inventory'
  },
  {
    icon: 'icon-admin',
    title: 'Administration',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-purple',
    width: 360,
    height: 272,
    url: '/admin'
  },
  {
    icon: 'icon-billing',
    title: 'Billing',
    src: 'https://placekitten.com/360/408',
    class: 'tile tile-orange',
    width: 359,
    height: 408,
    url: '/billing'
  },
  {
    icon: 'icon-groups',
    title: 'My groups',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-dark',
    width: 360,
    height: 272,
    url: '/groups'
  },
  {
    icon: 'icon-support',
    title: 'Support',
    src: 'https://placekitten.com/360/136',
    class: 'tile tile-dark',
    width: 359,
    height: 136,
    url: '/support'
  }
];

const iconImg = require('src/images/Training Icon@2x.png');

interface Iprops extends React.Props<Dashboard> {
  history: History;
}
interface Istate {
  user: Iuser;
}

class Dashboard extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
  }

  render() {
    const tileElements = tiles.map((tile: any) => {
      const styles = {
        width: tile.width,
        height: tile.height
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
