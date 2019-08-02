import * as React from 'react';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { IinitialState, Iuser, Itile } from '../../models';
import { RouteComponentProps } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { map } from 'lodash';
import { constants } from '../../constants/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { translate, TranslationFunction, I18n } from 'react-i18next';

interface itemProps extends Itile {
  t: TranslationFunction;
}

const Item = (props: itemProps) => {
  const { url, title, faIcon, imgIcon, t } = props;
  return (
    <LinkContainer to={url}>
      <ListGroupItem>
        {faIcon !== undefined && <FontAwesomeIcon icon={faIcon} fixedWidth />}
        {imgIcon !== undefined && (
          <img
            src={imgIcon}
            width={25}
            height={25}
            style={{ marginRight: 15 }}
            alt=""
          />
        )}
        <span className="menu-text">{t(title)}</span>
      </ListGroupItem>
    </LinkContainer>
  );
};

const MenuItems = ({ user, t }: { user: Iuser; t: TranslationFunction }) => (
  <ListGroup>
    <LinkContainer to={'/dashboard'}>
      <ListGroupItem>
        <img
          src={constants.icons.dashboard}
          width={25}
          height={25}
          style={{ marginRight: 15 }}
          alt=""
        />
        <span className="menu-text">{t('Dashboard')}</span>
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
