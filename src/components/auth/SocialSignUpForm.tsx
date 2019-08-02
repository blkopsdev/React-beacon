/* 
* SocialSignUpForm 
* User signs up with a Beacon AD account
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  FieldConfig,
  FormGroup,
  FormArray
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import { forEach } from 'lodash';
import { constants } from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { FormUtil } from '../common/FormUtil';
import { translate, TranslationFunction, I18n } from 'react-i18next';
// import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

// Field config to configure form
const fieldConfig = {
  controls: {
    first: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:first', colWidth: 6, type: 'text', name: 'first' }
    },
    last: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:last', colWidth: 6, type: 'text', name: 'last' }
    },
    email: {
      options: {
        validators: [
          Validators.required,
          Validators.pattern(
            /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
          )
        ]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:email', colWidth: 12, type: 'text', name: 'email' }
    }
  }
};

const testUser = {
  first: 'Little',
  last: 'Pixel',
  email: 'a@test.com'
};
interface Iprops extends React.Props<SocialSignupForm> {
  handleSubmit: any;
  handleCancel: any;
  loading: boolean;
  t: TranslationFunction;
  i18n: I18n;
}

class SocialSignupForm extends React.Component<Iprops, {}> {
  public formGroup: FormGroup | any;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(fieldConfig, this.props.t);
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      forEach(testUser, (value, key) => {
        this.formGroup.patchValue({ [key]: value });
      });
    }
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.formGroup.status === 'INVALID') {
      this.formGroup.markAsSubmitted();
      toastr.error(this.props.t('validationError'), '', constants.toastrError);
      return;
    }
    this.props.handleSubmit(this.formGroup.value);
  };
  setForm = (form: FormGroup | FormArray) => {
    this.formGroup = form;
    this.formGroup.meta = {
      loading: this.props.loading
    };
  };
  render() {
    const { t } = this.props;
    return (
      <form
        onSubmit={this.handleSubmit}
        className="clearfix beacon-form login-form"
      >
        <h5 style={{ padding: '0px 15px 10px 15px', color: '#fff' }}>
          Welcome to MyMedGas! Please signup below. If you are not a
          BeaconMedaes associate,{' '}
          <Link to="/signup" style={{ color: '#94cdff' }}>
            please click here to sign up.
          </Link>
          {/* <LinkContainer to="/azure_signup">
            <Button bsStyle="link">please click here to sign up.</Button>
          </LinkContainer> */}
        </h5>
        <FormGenerator onMount={this.setForm} fieldConfig={this.fieldConfig} />
        <Col xs={12} className="user-form-buttons">
          <Button
            bsStyle="link"
            type="button"
            onClick={this.props.handleCancel}
            style={{ color: 'white' }}
            disabled={this.props.loading}
            className="left-side"
          >
            {t('cancel')}
          </Button>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={this.props.loading}
            className="pull-right"
          >
            {t('signUp')}
          </Button>
        </Col>
      </form>
    );
  }
}
export default translate('user')(SocialSignupForm);
