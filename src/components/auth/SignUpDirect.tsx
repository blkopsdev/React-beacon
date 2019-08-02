/*
* Signup directly (no existing Microsoft account)
*/
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { IinitialState, Iuser, ItempUser } from '../../models';
import { signUpDirect } from '../../actions/userActions';
import { removeLoginRedirect } from '../../actions/redirectToReferrerAction';
import { Col, Grid, Row, Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import UserForm from './UserForm';

interface Iprops extends RouteComponentProps<{}> {
  removeLoginRedirect: () => Promise<void>;
  user: Iuser;
  signUpDirect: (tempUser: ItempUser) => Promise<void>;
  loading: boolean;
  t: TranslationFunction;
  i18n: I18n;
}
interface Istate {
  redirectToLogin: boolean;
  showSignupSuccess: boolean;
}

const SignUpSuccess = (props: any) => {
  const { t } = props;
  return (
    <div className="login-form signup-success" style={{ color: 'white' }}>
      <h2>{t('successTitle')}</h2>
      <p>{t('successBody1')}</p>
      <p>
        {t('successBody2')} <br /> {t('successBody3')}
      </p>
      <Button
        bsStyle="link"
        className="pull-right ok-button"
        style={{ color: 'white', margin: '12px' }}
        onClick={props.handleCancel}
      >
        {t('ok')}
      </Button>
    </div>
  );
};

class SignUpDirect extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      redirectToLogin: false,
      showSignupSuccess: false
    };
  }

  cancel = () => {
    this.setState({ redirectToLogin: true });
  };
  handleSubmit = (newUser: ItempUser) => {
    return this.props
      .signUpDirect(newUser)
      .then(() => {
        this.setState({ showSignupSuccess: true });
      })
      .catch((error: any) => console.error(error));
  };
  render() {
    const { t } = this.props;
    if (this.props.user.isAuthenticated) {
      this.props
        .removeLoginRedirect()
        .catch((error: any) => console.error(error));
      return <Redirect to={'/dashboard'} />;
    }
    if (this.state.redirectToLogin) {
      return <Redirect to={'/'} />;
    }
    const flipClass = this.state.showSignupSuccess
      ? 'flip-container flip'
      : 'flip-container';
    return (
      <div className="loginlayout signup">
        <Grid>
          <Row>
            <Col>
              <div className={flipClass}>
                <div className="flipper">
                  <div className="front">
                    <UserForm
                      handleSubmit={this.handleSubmit}
                      handleCancel={this.cancel}
                      loading={this.props.loading}
                    />
                  </div>
                  <div className="back">
                    <SignUpSuccess handleCancel={this.cancel} t={t} />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
const mapStateToProps = (state: IinitialState, ownProps: any) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0
  };
};

export default translate('auth')(
  connect(
    mapStateToProps,
    {
      removeLoginRedirect,
      signUpDirect
    }
  )(SignUpDirect)
);
