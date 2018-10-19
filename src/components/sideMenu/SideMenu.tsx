import * as React from 'react';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { IinitialState, Iuser } from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { map } from 'lodash';
import constants from '../../constants/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { translate, TranslationFunction, I18n } from 'react-i18next';

const Item = (props: any) => {
  const { url, title, icon, iconType } = props;
  return (
    <LinkContainer to={url}>
      <ListGroupItem>
        {iconType === 'fa' && <FontAwesomeIcon icon={icon} fixedWidth />}
        {iconType === 'img' && (
          <img src={icon} width={25} height={25} style={{ marginRight: 15 }} />
        )}
        {props.t(title)}
      </ListGroupItem>
    </LinkContainer>
  );
};

const MenuItems = ({ user, t }: any) => (
  <ListGroup>
    <LinkContainer to={'/dashboard'}>
      <ListGroupItem>
        <img
          src={constants.icons.dashboard}
          width={25}
          height={25}
          style={{ marginRight: 15 }}
        />
        Dashboard
      </ListGroupItem>
    </LinkContainer>
    {map(constants.tiles, tile => {
      if (constants.hasSecurityFunction(user, tile.securityFunction)) {
        return <Item key={tile.url} {...tile} t={t} />;
      } else {
        return '';
      }
    })}
  </ListGroup>
);

interface Iprops extends RouteComponentProps<{}> {
  user: Iuser;
  t: TranslationFunction;
  i18n: I18n;
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

        <MenuItems user={this.props.user} t={this.props.t} />
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
  )(SideMenu)
);
