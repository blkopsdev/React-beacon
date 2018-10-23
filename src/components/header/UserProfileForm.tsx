/* 
* UserProfile form
* Edit your profile
*/

import * as React from 'react';
import {
  FormGenerator,
  AbstractControl,
  Observable,
  Validators,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import { Iuser, Icustomer } from '../../models';
import { forEach, find, differenceBy, filter, map } from 'lodash';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const buildFieldConfig = (facilityOptions: any[]) => {
  // Field config to configure form
  const fieldConfigControls = {
    customer: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'company', colWidth: 12, type: 'text' }
    },
    facilities: {
      render: FormUtil.Select,
      meta: {
        options: facilityOptions,
        label: 'common:facility',
        colWidth: 12,
        placeholder: 'userQueue:facilitySearchPlaceholder',
        isMulti: true
      },
      options: {
        validators: Validators.required
      }
    }
  };
  const fieldConfig = {
    controls: { ...userBaseConfigControls, ...fieldConfigControls }
  };
  return fieldConfig as FieldConfig;
};

interface Iprops extends React.Props<UserProfileForm> {
  handleSubmit: any;
  handleCancel: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customers: Icustomer[];
  facilities: any;
  user: Iuser;
  facilityOptions: any[];
  getFacilitiesByCustomer: (value: string) => void;
}

class UserProfileForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  private fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(this.props.facilityOptions),
      this.props.t
    );

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }

  componentWillMount() {
    this.props.getFacilitiesByCustomer(this.props.user.customerID);
  }

  componentDidMount() {
    // set values
    forEach(this.props.user, (value, key) => {
      this.userForm.patchValue({ [key]: value });
    });
    const emailControl = this.userForm.get('email') as AbstractControlEdited;
    emailControl.disable();

    // get the customer name
    const customer = (find(
      this.props.customers,
      (cust: Icustomer) => cust.id === this.props.user.customerID
    ) as Icustomer) || { name: '' };

    if (customer && customer.name.length) {
      this.userForm.patchValue({ customer: customer.name });
    }
    const customerControl = this.userForm.get(
      'customer'
    ) as AbstractControlEdited;
    customerControl.disable();

    const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
      return find(this.props.user.facilities, { id: fac.value }) ? true : false;
    });
    this.userForm.patchValue({ facilities: facilitiesArray });
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      differenceBy(
        prevProps.facilityOptions,
        this.props.facilityOptions,
        'value'
      ).length ||
      prevProps.facilityOptions.length !== this.props.facilityOptions.length
    ) {
      const facilitySelectControl = this.userForm.get(
        'facilities'
      ) as AbstractControlEdited;
      facilitySelectControl.meta.options = this.props.facilityOptions;
      facilitySelectControl.stateChanges.next();
      const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
        return find(this.props.user.facilities, {
          id: fac.value
        })
          ? true
          : false;
      });
      this.userForm.patchValue({ facilities: facilitiesArray });
    }
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    const facilitiesArray = map(
      this.userForm.value.facilities,
      (option: { value: string; label: string }) => {
        return { id: option.value };
      }
    );
    this.props.handleSubmit({
      ...this.props.user,
      ...this.userForm.value,
      facilities: facilitiesArray,
      email: this.props.user.email // have to add back the email because disabling the input removes it
    });
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `user-form profile-form ${this.props.colorButton}`;

    return (
      <div>
        <div className={formClassName}>
          <form onSubmit={this.handleSubmit} className="user-form">
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.fieldConfig}
            />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="default"
                type="button"
                className="pull-left"
                onClick={this.props.handleCancel}
              >
                {t('common:cancel')}
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
        </div>
      </div>
    );
  }
}
export default translate('user')(UserProfileForm);
