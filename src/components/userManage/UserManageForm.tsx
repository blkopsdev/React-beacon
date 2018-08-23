/* 
* UserManageForm 
* Edit existing users
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
import { forEach, find, map, differenceBy, filter } from 'lodash';
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
    facilities: {
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
    },
    isActive: {
      render: FormUtil.Toggle,
      meta: { label: 'user:active', colWidth: 12 }
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
    if (!this.props.selectedUser) {
      return;
    }
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
    }
    const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
      return find(this.props.selectedUser.facilities, { id: fac.value })
        ? true
        : false;
    });
    this.userForm.patchValue({ facilities: facilitiesArray });
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

    const { customerID, facilities } = this.props.selectedUser;
    this.userForm.patchValue({
      customerID: find(this.props.customerOptions, { value: customerID })
    });
    // if there is a customerID then get facilities
    if (customerID.length) {
      this.props.getFacilitiesByCustomer(customerID);
    }
    const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
      return find(facilities, { id: fac.value }) ? true : false;
    });
    this.userForm.patchValue({ facilities: facilitiesArray });
    document.addEventListener('newFacility', this.handleNewFacility, false);
  }
  componentWillUnmount() {
    document.removeEventListener('newFacility', this.handleNewFacility, false);
  }
  handleNewFacility = (event: any) => {
    const facilityID = event.detail;
    // now select the facility the user just added
    // might be a better way to do this, but we are comparing the two arrays and finding the new facility
    const newFacility = find(this.props.facilityOptions, { value: facilityID });
    const newFacilitiesArray = [...this.userForm.value.facilities, newFacility];
    this.userForm.patchValue({ facilities: newFacilitiesArray });
  };

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
      this.userForm.value.facilities,
      (option: { value: string; label: string }) => {
        return { id: option.value };
      }
    );
    this.props.handleSubmit(
      {
        id: this.props.selectedUser.id,
        ...this.userForm.value,
        customerID: this.userForm.value.customerID.value,
        facilities: facilitiesArray
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

    const formClassName = `user-form manage-form ${this.props.colorButton}`;

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
