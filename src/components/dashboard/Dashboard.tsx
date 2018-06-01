import * as React from 'react';
import { connect } from 'react-redux';
import { InitialState, Iuser } from '../../models';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  transitionDuration: 0
};

const elements: any = [
  {
    icon: 'icon-alerts',
    title: 'Alerts',
    src: 'https://placekitten.com/360/136',
    class: 'tile tile-dark',
    width: 360,
    height: 136
  },
  {
    icon: 'icon-training',
    title: 'Training',
    src: 'https://placekitten.com/360/408',
    class: 'tile tile-green',
    width: 360,
    height: 408
  },
  {
    icon: 'icon-maintenance',
    title: 'Maintenance',
    src: 'https://placekitten.com/360/408',
    class: 'tile tile-blue',
    width: 360,
    height: 408
  },
  {
    icon: 'icon-reports',
    title: 'Reports',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-orange',
    width: 360,
    height: 272
  },
  {
    icon: 'icon-team',
    title: 'Manage Team',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-blue',
    width: 359,
    height: 272
  },
  {
    icon: 'icon-docs',
    title: 'Documents & Legal',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-purple',
    width: 360,
    height: 272
  },
  {
    icon: 'icon-inventory',
    title: 'Inventory',
    src: 'https://placekitten.com/360/408',
    class: 'tile tile-green',
    width: 360,
    height: 408
  },
  {
    icon: 'icon-admin',
    title: 'Administration',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-purple',
    width: 360,
    height: 272
  },
  {
    icon: 'icon-billing',
    title: 'Billing',
    src: 'https://placekitten.com/360/408',
    class: 'tile tile-orange',
    width: 359,
    height: 408
  },
  {
    icon: 'icon-groups',
    title: 'My groups',
    src: 'https://placekitten.com/360/272',
    class: 'tile tile-dark',
    width: 360,
    height: 272
  },
  {
    icon: 'icon-support',
    title: 'Support',
    src: 'https://placekitten.com/360/136',
    class: 'tile tile-dark',
    width: 359,
    height: 136
  }
];

const iconImg = require('src/images/Training Icon@2x.png');

interface Iprops extends React.Props<Dashboard> {}
interface Istate {
  user: Iuser;
}

class Dashboard extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
  }

  render() {
    const childElements = elements.map((element: any) => {
      const styles = {
        width: element.width,
        height: element.height
      };
      return (
        <div key={element.icon} className={element.class} style={styles}>
          <img src={element.src} />
          <span className="title">
            <img src={iconImg} />
            {element.title}
          </span>
        </div>
      );
    });

    return (
      <Masonry
        className={'tiles'} // default ''
        elementType={'div'} // default 'div'
        options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
      >
        {childElements}
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
