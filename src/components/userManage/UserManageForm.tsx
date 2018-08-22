/* 
* UserManageForm 
* Edit and approve new users
* Note: react-reactive-form is used for all form elements except for the facilities select, because we could not
* figure out how to update the options for the select after the customer was selected.
* the only problem with this is that the validation is complicated by having one field outside the generated form.
* TODO a) wait for a response to your question here:  https://github.com/bietkul/react-reactive-form/issues/5
* 
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import { forEach, find, map } from 'lodash';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { Iuser } from '../../models';
import EditFacilityModal from '../common/EditFacilityModal';

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const buildFieldConfig = (
  customerOptions: any[],
  facilityOptions: any[],
  getFacilitiesByCustomer: (value: string) => Promise<void>,
  toggleEditCustomerModal: () => void,
  toggleEditFacilityModal: () => void
) => {
  // Field config to configure form
  const fieldConfigControls = {
    customerID: {
      render: FormUtil.SelectWithButton,
      meta: {
        options: customerOptions,
        getFacilitiesByCustomer,
        label: 'common:customer',

        colWidth: 12,
        placeholder: 'userManage:customerSearchPlaceholder',
        buttonName: 'userManage:addCustomerButton',
        buttonAction: toggleEditCustomerModal
      },
      options: {
        validators: [
          Validators.required,
          (c: any) => {
            if (c.value && c.value.value) {
              getFacilitiesByCustomer(c.value.value);
            }
          }
        ]
      }
    },
    facilityID: {
      render: FormUtil.SelectWithButton,
      meta: {
        options: facilityOptions,
        label: 'common:facility',

        colWidth: 12,
        placeholder: 'userQueue:facilitySearchPlaceholder',
        buttonName: 'userQueue:facilityButton',
        buttonAction: toggleEditFacilityModal,
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

interface Iprops extends React.Props<UserManageForm> {
  handleSubmit: any;
  handleCancel: any;
  selectedUser: Iuser;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customerOptions: any[];
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  facilityOptions: any[];
  toggleEditCustomerModal: () => void;
  toggleEditFacilityModal: () => void;
}

class UserManageForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(
        this.props.customerOptions,
        this.props.facilityOptions,
        this.props.getFacilitiesByCustomer,
        this.props.toggleEditCustomerModal,
        this.props.toggleEditFacilityModal
      ),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      prevProps.facilityOptions.length !== this.props.facilityOptions.length
    ) {
      const facilitySelectControl = this.userForm.get(
        'facilityID'
      ) as AbstractControlEdited;
      facilitySelectControl.meta.options = this.props.facilityOptions;
      facilitySelectControl.stateChanges.next();
    }
  }

  componentDidMount() {
    if (!this.props.selectedUser) {
      console.error('missing user');
      return;
    }
    // set values
    forEach(this.props.selectedUser, (value, key) => {
      this.userForm.patchValue({ [key]: value });
    });
    // TODO: CHANGE TO REAL CUSTOMER STUFF
    // hardcode CustomerID for now
    this.userForm.patchValue({
      fac: 'HQ Raleigh'
    });
    const { customerID } = this.props.selectedUser;
    this.userForm.patchValue({
      customerID: find(this.props.customerOptions, { value: customerID })
    });
  }

  handleSubmit = (
    e: React.MouseEvent<HTMLFormElement>,
    shouldApprove?: boolean
  ) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    const facilitiesArray = map(
      this.userForm.value.facilityID,
      (option: { value: string; label: string }) => {
        return option.value;
      }
    );
    this.props.handleSubmit(
      {
        id: this.props.selectedUser.id,
        ...this.userForm.value,
        customerID: this.userForm.value.customerID.value,
        facilityID: facilitiesArray
      },
      shouldApprove,
      this.props.selectedUser.id
    );
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;
    const selectedCustomer = this.userForm
      ? this.userForm.value.customerID
      : undefined;

    return (
      <div>
        <div className="user-form manage-form">
          <form onSubmit={this.handleSubmit} className="user-form">
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.fieldConfig}
            />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="link"
                type="button"
                className="pull-left left-side"
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
        </div>
        <EditFacilityModal
          t={this.props.t}
          colorButton={this.props.colorButton}
          selectedCustomer={selectedCustomer}
        />
      </div>
    );
  }
}
export default translate('user')(UserManageForm);
