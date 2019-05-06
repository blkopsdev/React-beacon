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
import { orderBy } from 'lodash';
import { constants } from 'src/constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { Icustomer, Ioption } from 'src/models';
// import { IqueueObject } from '../../models';

// add the bootstrap form-control class to the react-select select component

const fieldConfig = {
  controls: {
    name: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'facilityNameLabel', colWidth: 12, name: 'fac-name' }
    },
    address: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: {
        label: 'user:address',
        colWidth: 8,
        type: 'text',
        name: 'address'
      }
    },
    address2: {
      render: FormUtil.TextInput,
      meta: {
        label: 'user:address2',
        colWidth: 4,
        type: 'text',
        name: 'address2',
        required: false
      }
    },
    city: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:city', colWidth: 5, type: 'text', name: 'city' }
    },
    state: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:state', colWidth: 3, type: 'text', name: 'state' }
    },
    postalCode: {
      options: {
        validators: [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9\- ]{0,10}[a-zA-Z0-9]$/)
        ]
      },
      render: FormUtil.TextInput,
      meta: { label: 'user:zip', colWidth: 4, type: 'tel', name: 'postal-code' }
    },
    countryID: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.Select,
      meta: {
        options: orderBy(constants.countries, 'label'),
        label: 'user:country',
        colWidth: 12,
        placeholder: 'userQueue:countrySearchPlaceholder',
        name: 'country'
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
  selectedCustomer: Icustomer;
}

class EditFacilityForm extends React.Component<Iprops, {}> {
  private userForm: AbstractControl;
  private fieldConfig: FieldConfig;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(fieldConfig, this.props.t);
  }
  // componentDidUpdate(prevProps: Iprops) {

  // }

  componentDidMount() {
    if (!this.userForm) {
      return;
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
    const stateFormControl = this.userForm.get('state');
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
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    const newFacility = {
      ...this.userForm.value,
      countryID: this.userForm.value.countryID.value,
      customerID: this.props.selectedCustomer.id
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
