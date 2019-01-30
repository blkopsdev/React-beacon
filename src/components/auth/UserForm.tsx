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
import { Ioption } from 'src/models';

// Field config to configure form
const fieldConfigControls = {
  tempCompany: {
    options: {
      validators: [Validators.required, FormUtil.validators.requiredWithTrim]
    },
    render: FormUtil.TextInput,
    meta: { label: 'company', colWidth: 12, type: 'text', name: 'company' }
  },
  tempAddress: {
    options: {
      validators: [Validators.required, FormUtil.validators.requiredWithTrim]
    },
    render: FormUtil.TextInput,
    meta: { label: 'address', colWidth: 8, type: 'text', name: 'temp-address' }
  },
  tempAddress2: {
    render: FormUtil.TextInput,
    meta: {
      label: 'address2',
      colWidth: 4,
      type: 'text',
      name: 'temp-address2'
    }
  },
  tempCity: {
    options: {
      validators: [Validators.required, FormUtil.validators.requiredWithTrim]
    },
    render: FormUtil.TextInput,
    meta: { label: 'city', colWidth: 5, type: 'text', name: 'temp-city' }
  },
  tempState: {
    options: {
      validators: [Validators.required, FormUtil.validators.requiredWithTrim]
    },
    render: FormUtil.TextInput,
    meta: { label: 'state', colWidth: 3, type: 'text', name: 'temp-state' }
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
    meta: { label: 'zip', colWidth: 4, type: 'tel', name: 'temp-zip' }
  },
  countryID: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.Select,
    meta: {
      options: constants.countries,
      label: 'user:country',
      colWidth: 12,
      placeholder: 'userQueue:countrySearchPlaceholder',
      name: 'country'
    }
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
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(fieldConfig, this.props.t);
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      forEach(testUser, (value, key) => {
        this.userForm.patchValue({ [key]: value });
      });
    }
    this.subscription = this.userForm
      .get('countryID')
      .valueChanges.subscribe((value: Ioption) => {
        this.onCountryChanges(value.value);
      });

    this.userForm.patchValue({
      countryID: {
        value: 'ABC5D95C-129F-4837-988C-0BF4AE1F3B67',
        label: 'United States of America'
      }
    });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCountryChanges = (value: string) => {
    const stateFormControl = this.userForm.get('tempState');
    if (value === `ABC5D95C-129F-4837-988C-0BF4AE1F3B67`) {
      stateFormControl.enable();
      stateFormControl.setValidators([
        Validators.required,
        FormUtil.validators.requiredWithTrim
      ]);
      stateFormControl.patchValue(null);
    } else {
      stateFormControl.patchValue(null);
      stateFormControl.disable();
      stateFormControl.setValidators(null);
    }
  };

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
      <form
        onSubmit={this.handleSubmit}
        className="clearfix beacon-form login-form"
      >
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
export default translate('user')(UserForm);
