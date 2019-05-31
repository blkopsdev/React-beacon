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

<<<<<<< HEAD
import { FormUtil } from '../common/FormUtil';
import { Ioption } from 'src/models';
=======
import { FormUtil } from './FormUtil';
import { Icustomer, Ifacility, Ioption } from 'src/models';
>>>>>>> phase_3

// add the bootstrap form-control class to the react-select select component

interface Iprops {
  handleSubmit: any;
  handleEdit: any;
  handleCancel: any;
  clearSelectedFacilityID: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  selectedCustomer: Icustomer & Ioption;
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
  private debounce: any;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      fieldConfig: this.buildFieldConfig()
    };
  }

  async componentDidMount() {
    if (!this.formGroup) {
      return;
    }
    
    await this.props.setFormValues(this.props.selectedFacility);
    this.setState({ fieldConfig: this.buildFieldConfig() });
    if (!this.props.selectedFacility.countryID) {
      this.formGroup.patchValue({
        countryID: {
          value: 'ABC5D95C-129F-4837-988C-0BF4AE1F3B67',
          label: 'United States of America'
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.props.clearSelectedFacilityID();
    this.props.setFormValues({});
    this.cleanForm();
  }

  buildFieldConfig = () => {
    const formValues = this.props.formValues;
    let {
      name,
      address,
      address2,
      city,
      state,
      postalCode,
      countryID
    } = this.props.selectedFacility;

    name = formValues.name || name;
    address = formValues.address || address;
    address2 = formValues.address2 || address2;
    city = formValues.city || city;
    state = formValues.state || state;
    postalCode = formValues.postalCode || postalCode;
    countryID =
      (formValues.countryID && formValues.countryID.value) || countryID;

    const countries = orderBy(constants.countries, 'label');
    const selectedCountry = countries.find(
      c => c.value === countryID.toUpperCase()
    );
    const fieldConfigControls = {
      name: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        render: FormUtil.TextInput,
        meta: { label: 'manageCustomerAndFacility:facilityNameLabel', colWidth: 12, name: 'fac-name' },
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
          colWidth: 6,
          type: 'text',
          name: 'address'
        },
        formState: address
      },
      address2: {
        render: FormUtil.TextInput,
        meta: {
          label: 'user:address2',
          colWidth: 6,
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
          options: countries,
          label: 'user:country',
          colWidth: 12,
          placeholder: 'userQueue:countrySearchPlaceholder',
          name: 'country'
        },
        formState: {
          value: selectedCountry,
          disabled: false
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
    switch (key) {
      case 'countryID':
        this.onCountryChanges(value);
        break;
      default:
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.props.updateFormValue({ [key]: value });
        }, 200);
        break;
    }
  };

  onCountryChanges = (value: any) => {
    const stateFormControl = this.formGroup.get('state');
    if (
      value &&
      value.value.toUpperCase() === `ABC5D95C-129F-4837-988C-0BF4AE1F3B67`
    ) {
      stateFormControl.enable();
      stateFormControl.setValidators([
        Validators.required,
        FormUtil.validators.requiredWithTrim
      ]);
      stateFormControl.patchValue(null);
      this.props.updateFormValue({ state: '' });
    } else {
      this.props.updateFormValue({ state: '' });
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

    const customerID =
      this.props.selectedCustomer.id || this.props.selectedCustomer.value;

    const newFacility = {
      ...this.formGroup.value,
      countryID: this.formGroup.value.countryID.value,
      customerID
    };
    if (this.props.selectedFacility.id) {
      newFacility['id'] = this.props.selectedFacility.id;
      this.props.handleEdit(newFacility);
    } else {
      this.props.handleSubmit(newFacility);
    }
  };

  setForm = (form: FormGroup) => {
    this.formGroup = form;
    this.formGroup.meta = {
      loading: this.props.loading
    };
    this.subscribeToChanges();
  };

  cleanForm = () => {
    this.formGroup.reset();
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
              onClick={() => {
                this.props.handleCancel();
                this.props.setFormValues({});
              }}
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
          onUnmount={this.cleanForm}
          onMount={this.setForm}
          fieldConfig={this.state.fieldConfig}
        />
        <Col xs={12} className="form-buttons text-right">
          <Button
            bsStyle="default"
            type="button"
            className="pull-left"
            onClick={() => {
              this.props.handleCancel();
              this.props.setFormValues({});
            }}
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
