/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { IinitialState, Iuser } from '../../models';
import { userLogout, toggleEditProfileModal } from '../../actions/userActions';
import { isFullyAuthenticated } from '../../actions/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import EditProfileModal from './EditProfileModal';

interface Iprops {
  user: Iuser;
  userLogout: any;
  loading: boolean;
  t: TranslationFunction;
  i18n: I18n;
  toggleEditProfileModal: any;
}

interface Istate {
  menuOpen: boolean;
}

class Header extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      menuOpen: false
    };
  }
  handleMenuSelect = (eventKey: any) => {
    switch (eventKey) {
      case '1':
        this.props.toggleEditProfileModal();
        break;
      case '2':
        this.props.userLogout();
        break;
      default:
        break;
    }
  };

  render() {
    const { t } = this.props;
    if (!isFullyAuthenticated(this.props.user) && this.props.loading) {
      return (
        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1" />
          <div className="sk-cube sk-cube2" />
          <div className="sk-cube sk-cube3" />
          <div className="sk-cube sk-cube4" />
          <div className="sk-cube sk-cube5" />
          <div className="sk-cube sk-cube6" />
          <div className="sk-cube sk-cube7" />
          <div className="sk-cube sk-cube8" />
          <div className="sk-cube sk-cube9" />
        </div>
      );
    } else if (!isFullyAuthenticated(this.props.user) && !this.props.loading) {
      return null;
    }
    const menuClass = this.state.menuOpen ? 'menu-open' : '';
    return (
      <span>
        {this.props.loading && (
          <div className="sk-cube-grid">
            <div className="sk-cube sk-cube1" />
            <div className="sk-cube sk-cube2" />
            <div className="sk-cube sk-cube3" />
            <div className="sk-cube sk-cube4" />
            <div className="sk-cube sk-cube5" />
            <div className="sk-cube sk-cube6" />
            <div className="sk-cube sk-cube7" />
            <div className="sk-cube sk-cube8" />
            <div className="sk-cube sk-cube9" />
          </div>
        )}

        <span className="profile">
          <span className="profile-text">
            {t('welcome')}&nbsp;
            <span className="name">{this.props.user.first}</span>
            <span className="vertical" />
          </span>
          <ButtonToolbar className="header-menu">
            <Dropdown
              onToggle={isOpen => {
                this.setState({ menuOpen: isOpen });
              }}
              id="header-dropdown"
              onSelect={this.handleMenuSelect}
            >
              <Dropdown.Toggle bsStyle="link" className="header-menu-button">
                <FontAwesomeIcon icon={['far', 'cog']} size="lg" />
              </Dropdown.Toggle>
              <div className="white-rectangle" />
              <Dropdown.Menu className={menuClass}>
                <MenuItem eventKey="1">
                  <FontAwesomeIcon icon="user" fixedWidth /> &nbsp;{' '}
                  {t('profile')}
                </MenuItem>
                <MenuItem eventKey="2">
                  <FontAwesomeIcon icon={['far', 'sign-out']} fixedWidth />{' '}
                  &nbsp; {t('logout')}
                </MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonToolbar>
        </span>
        <EditProfileModal t={this.props.t} colorButton="warning" />
      </span>
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default translate('common')(
  connect(
    mapStateToProps,
    { userLogout, toggleEditProfileModal }
  )(Header)
);
