/*
* Edit Customer Form
* Add and Edit facilities
*
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  FieldConfig,
  FormGroup,
  GroupProps
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import { orderBy } from 'lodash';
import { constants } from 'src/constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { Icustomer, Ifacility } from 'src/models';
// import { IqueueObject } from '../../models';

// add the bootstrap form-control class to the react-select select component

interface Iprops {
  handleSubmit: any;
  handleCancel: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  selectedCustomer: Icustomer;
  updateFormValue: (formValue: { [key: string]: any }) => void;
  setFormValues: (formValues: { [key: string]: any }) => void;
  formValues: { [key: string]: any };
  selectedFacility: Ifacility;
}

interface IState {
  fieldConfig: FieldConfig;
}
class EditFacilityForm extends React.Component<Iprops, IState> {
  private formGroup: FormGroup;
  private subscription: any;

  constructor(props: Iprops) {
    super(props);
    this.state = {
      fieldConfig: this.buildFieldConfig()
    };
  }

  // componentDidUpdate(prevProps: Iprops) {

  // }

  componentDidMount() {
    if (!this.formGroup) {
      return;
    }
    console.log(this.props.selectedFacility);
    this.props.setFormValues(this.props.selectedFacility);
    this.setState({ fieldConfig: this.buildFieldConfig() });
    this.formGroup.patchValue({
      countryID: {
        value: 'ABC5D95C-129F-4837-988C-0BF4AE1F3B67',
        label: 'United States of America'
      }
    });
  }

  buildFieldConfig = () => {
    const formValues = this.props.formValues;
    let {
      name,
      address,
      address2,
      city,
      state,
      postalCode
    } = this.props.selectedFacility;

    name = formValues.name || name;
    address = formValues.address || address;
    address2 = formValues.address2 || address2;
    city = formValues.city || city;
    state = formValues.state || state;
    postalCode = formValues.postalCode || postalCode;

    const fieldConfigControls = {
      name: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        render: FormUtil.TextInput,
        meta: { label: 'facilityNameLabel', colWidth: 12, name: 'fac-name' },
        formState: name
      },
      address: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'user:address',
          colWidth: 8,
          type: 'text',
          name: 'address'
        },
        formState: address
      },
      address2: {
        render: FormUtil.TextInput,
        meta: {
          label: 'user:address2',
          colWidth: 4,
          type: 'text',
          name: 'address2',
          required: false
        },
        formState: address2
      },
      city: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        render: FormUtil.TextInput,
        meta: { label: 'user:city', colWidth: 5, type: 'text', name: 'city' },
        formState: city
      },
      state: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        render: FormUtil.TextInput,
        meta: { label: 'user:state', colWidth: 3, type: 'text', name: 'state' },
        formState: state
      },
      postalCode: {
        options: {
          validators: [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9\- ]{0,10}[a-zA-Z0-9]$/)
          ]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'user:zip',
          colWidth: 4,
          type: 'tel',
          name: 'postal-code'
        },
        formState: postalCode
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
    } as { [key: string]: GroupProps };
    const fieldConfig = {
      controls: { ...fieldConfigControls }
    };
    return FormUtil.translateForm(fieldConfig, this.props.t);
  };

  /*
  * (reusable)
  * subscribe to the formGroup changes
  */
  subscribeToChanges = () => {
    for (const key in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(key)) {
        this.subscription = this.formGroup
          .get(key)
          .valueChanges.subscribe((value: any) => {
            this.onValueChanges(value, key);
          });
      }
    }
  };

  /*
* (reusable)
* set the table filters to redux on each value change
*/
  onValueChanges = (value: any, key: string) => {
    this.props.updateFormValue({ [key]: value });
    if (key === 'countryID') {
      this.onCountryChanges(value);
    }
  };

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCountryChanges = (value: any) => {
    const stateFormControl = this.formGroup.get('state');
    if (value.value === `ABC5D95C-129F-4837-988C-0BF4AE1F3B67`) {
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
    if (this.formGroup.status === 'INVALID') {
      this.formGroup.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    // console.log(this.formGroup.value);
    const newFacility = {
      ...this.formGroup.value,
      countryID: this.formGroup.value.countryID.value,
      customerID: this.props.selectedCustomer.id
    };
    this.props.handleSubmit(newFacility);
  };

  setForm = (form: FormGroup) => {
    this.formGroup = form;
    this.formGroup.meta = {
      loading: this.props.loading
    };
    this.subscribeToChanges();
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
        <FormGenerator
          onMount={this.setForm}
          fieldConfig={this.state.fieldConfig}
        />
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
