import * as React from 'react';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { InitialState, Iuser } from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { map } from 'lodash';
import constants from '../../constants/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Item = (props: any) => {
  const { url, title, icon } = props;
  return (
    <LinkContainer to={url}>
      <ListGroupItem>
        <FontAwesomeIcon icon={icon} fixedWidth />
        {title}
      </ListGroupItem>
    </LinkContainer>
  );
};

const MenuItems = ({ user }: any) => (
  <ListGroup>
    <LinkContainer to={'/dashboard'}>
      <ListGroupItem>
        <FontAwesomeIcon icon={['far', 'th']} /> Dashboard
      </ListGroupItem>
    </LinkContainer>
    {map(constants.tiles, tile => {
      if (constants.hasSecurityFunction(user, tile.securityFunction)) {
        return <Item key={tile.url} {...tile} />;
      } else {
        return '';
      }
    })}
  </ListGroup>
);

interface Iprops extends RouteComponentProps<SideMenu> {
  user: Iuser;
}

class SideMenu extends React.Component<Iprops, {}> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div className="side-menu">
        {/*        <Row>
          <Col xs={12}>Welcome {this.props.user.first}</Col>
        </Row>*/}

        <MenuItems user={this.props.user} />
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
)(SideMenu);
