/* 
* Edit Customer Form 
* Add and Edit facilities
* 
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
// import { forEach, find } from "lodash";
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
// import { IqueueObject } from '../../models';

// add the bootstrap form-control class to the react-select select component

const fieldConfig = {
  controls: {
    name: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'facilityNameLabel', colWidth: 12 }
    },
    address: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:address', colWidth: 8, type: 'text' }
    },
    address2: {
      render: FormUtil.TextInput,
      meta: { label: 'user:address2', colWidth: 4, type: 'text' }
    },
    city: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:city', colWidth: 5, type: 'text' }
    },
    state: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:state', colWidth: 3, type: 'text' }
    },
    postalCode: {
      options: {
        validators: [
          Validators.required,
          Validators.pattern(
            /(^[0-9]{5}(-[0-9]{4})?$)|(^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]{1}[0-9]{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstv‌​xy]{1} *[0-9]{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvxy]{1}[0-9]{1}$)/
          )
        ]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:zip', colWidth: 4, type: 'tel' }
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
        placeholder: 'userQueue:countrySearchPlaceholder'
      }
    }
  }
};

interface Iprops {
  handleSubmit: any;
  handleCancel: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  selectedCustomer: { value: string; label: string };
}

class EditFacilityForm extends React.Component<Iprops, {}> {
  private userForm: AbstractControl;
  private fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(fieldConfig, this.props.t);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  // componentDidUpdate(prevProps: Iprops) {

  // }

  // componentDidMount() {

  // }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    const newFacility = {
      ...this.userForm.value,
      countryID: this.userForm.value.countryID.value,
      customerID: this.props.selectedCustomer.value
    };
    this.props.handleSubmit(newFacility);
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;
    if (!this.props.selectedCustomer) {
      return (
        <div>
          <Col xs={12}>
            <h4>{t('selectCustomerWarning')}</h4>
          </Col>
          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.props.handleCancel}
            >
              {t('cancel')}
            </Button>
          </Col>
        </div>
      );
    }

    return (
      <form
        onSubmit={this.handleSubmit}
        className="clearfix beacon-form facility-form"
      >
        <FormGenerator onMount={this.setForm} fieldConfig={this.fieldConfig} />
        <Col xs={12} className="form-buttons text-right">
          <Button
            bsStyle="default"
            type="button"
            className="pull-left"
            onClick={this.props.handleCancel}
          >
            {t('cancel')}
          </Button>
          <Button
            bsStyle={this.props.colorButton}
            type="submit"
            disabled={this.props.loading}
          >
            {t('save')}
          </Button>
        </Col>
      </form>
    );
  }
}
export default translate('common')(EditFacilityForm);
