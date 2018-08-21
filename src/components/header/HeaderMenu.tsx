/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { IinitialState, Iuser } from '../../models';
import { userLogout } from '../../actions/userActions';
import { isFullyAuthenticated } from '../../actions/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { translate, TranslationFunction, I18n } from 'react-i18next';

interface Iprops extends React.Props<Header> {
  user: Iuser;
  userLogout: any;
  loading: boolean;
  t: TranslationFunction;
  i18n: I18n;
}

class Header extends React.Component<Iprops, {}> {
  constructor(props: Iprops) {
    super(props);
  }

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
          {t('welcome')}&nbsp;
          <span className="name">{this.props.user.first}</span>
          <span className="vertical" />
          <Button
            bsStyle="link"
            onClick={this.props.userLogout}
            className="header-settings"
          >
            <FontAwesomeIcon icon={['far', 'cog']} size="lg" />
          </Button>
        </span>
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
    { userLogout }
  )(Header)
);
