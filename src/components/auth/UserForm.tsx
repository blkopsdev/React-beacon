/* 
* UserForm 
* User signs up directly to the platform
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import { forEach } from 'lodash';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { translate, TranslationFunction, I18n } from 'react-i18next';

// Field config to configure form
const fieldConfigControls = {
  tempCompany: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'company', colWidth: 12, type: 'text' }
  },
  tempAddress: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'address', colWidth: 8, type: 'text' }
  },
  tempAddress2: {
    render: FormUtil.TextInput,
    meta: { label: 'address2', colWidth: 4, type: 'text' }
  },
  tempCity: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'city', colWidth: 5, type: 'text' }
  },
  tempState: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'state', colWidth: 3, type: 'text' }
  },
  tempZip: {
    options: {
      validators: [
        Validators.required,
        Validators.pattern(
          /(^[0-9]{5}(-[0-9]{4})?$)|(^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]{1}[0-9]{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstv‌​xy]{1} *[0-9]{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvxy]{1}[0-9]{1}$)/
        )
      ]
    },
    render: FormUtil.TextInput,
    meta: { label: 'zip', colWidth: 4, type: 'tel' }
  }
};
const fieldConfig = {
  controls: { ...userBaseConfigControls, ...fieldConfigControls }
};

const testUser = {
  first: 'Little',
  last: 'Pixel',
  email: 'a@test.com',
  position: 'president',
  tempAddress: '12 street',
  tempAddress2: '2 street',
  tempCity: 'mycity',
  tempZip: '77080',
  tempState: 'TX',
  tempCompany: 'BigPixel',
  phone: '888-333-1121'
};
interface Iprops extends React.Props<UserForm> {
  handleSubmit: any;
  handleCancel: any;
  loading: boolean;
  t: TranslationFunction;
  i18n: I18n;
}

class UserForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(fieldConfig, this.props.t);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      forEach(testUser, (value, key) => {
        this.userForm.patchValue({ [key]: value });
      });
    }
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error(this.props.t('validationError'), '', constants.toastrError);
      return;
    }
    this.props.handleSubmit(this.userForm.value);
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      handleCancel: this.props.handleCancel,
      cancelText: 'Cancel',
      submitText: 'Sign Up',
      loading: this.props.loading
    };
  };
  render() {
    const { t } = this.props;
    return (
      <div className="loginForm">
        <form onSubmit={this.handleSubmit} className="user-form">
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.fieldConfig}
          />
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
      </div>
    );
  }
}
export default translate('user')(UserForm);
