/* 
* EditUserForm 
* Edit existing users
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable
} from 'react-reactive-form';
import { forEach, find, map, differenceBy, filter, includes } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { Ioption, Iuser } from '../../models';
import {
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import {
  updateUser,
  toggleSecurityFunctionsModal
} from '../../actions/manageUserActions';
import EditFacilityModal from '../common/EditFacilityModal';
import { constants } from 'src/constants/constants';

// passing in an object, but we need an array back
const securityOptions = [
  ...FormUtil.convertToOptions(constants.securityFunctions)
];

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
  toggleEditCustomerModalCB: typeof toggleEditCustomerModal,
  toggleEditFacilityModalCB: typeof toggleEditFacilityModal,
  toggleSecurityFunctionsModalCB: typeof toggleSecurityFunctionsModal
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
        buttonAction: toggleEditCustomerModalCB
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
        buttonAction: toggleEditFacilityModalCB,
        isMulti: true
      },
      options: {
        validators: Validators.required
      }
    },
    securityFunctions: {
      render: FormUtil.SelectWithButton,
      meta: {
        options: securityOptions,
        label: 'userManage:securityLabel',
        colWidth: 12,
        placeholder: 'userManage:securitySearchPlaceholder',
        buttonName: 'userManage:securityButton',
        buttonAction: toggleSecurityFunctionsModalCB,
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

interface Iprops extends React.Props<EditUserForm> {
  selectedUser: Iuser;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customerOptions: Ioption[];
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  facilityOptions: Ioption[];
  updateUser: typeof updateUser;
  toggleModal: () => void;
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
  toggleSecurityFunctionsModal: typeof toggleSecurityFunctionsModal;
}

class EditUserForm extends React.Component<Iprops, {}> {
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
        this.props.toggleEditFacilityModal,
        this.props.toggleSecurityFunctionsModal
      ),
      this.props.t
    );
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

    const {
      customerID,
      facilities,
      securityFunctions
    } = this.props.selectedUser;
    this.userForm.patchValue({
      customerID: find(
        this.props.customerOptions,
        (cust: Ioption) => cust.value === customerID
      )
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

    const securityFunctionsArray = filter(securityOptions, (sec: any) => {
      return includes(securityFunctions, sec.value);
    });
    const securityfunctionsArrayTranslated = map(
      securityFunctionsArray,
      option => ({ value: option.value, label: this.props.t(option.label) })
    );
    this.userForm.patchValue({
      securityFunctions: securityfunctionsArrayTranslated
    });

    const emailControl = this.userForm.get('email') as AbstractControlEdited;
    emailControl.disable();
  }
  componentDidUpdate(prevProps: Iprops) {
    if (!this.props.selectedUser) {
      console.error('missing selected User');
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
      const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
        return find(this.props.selectedUser.facilities, { id: fac.value })
          ? true
          : false;
      });
      this.userForm.patchValue({ facilities: facilitiesArray });
    }
    if (
      differenceBy(
        prevProps.customerOptions,
        this.props.customerOptions,
        'value'
      ).length ||
      prevProps.customerOptions.length !== this.props.customerOptions.length
    ) {
      const customerSelectControl = this.userForm.get(
        'customerID'
      ) as AbstractControlEdited;
      customerSelectControl.meta.options = this.props.customerOptions;
      customerSelectControl.stateChanges.next();
      // now select the customer the user just added
      // might be a better way to do this, but we are comparing the two arrays and finding the new customer
      const newCustomer = filter(this.props.customerOptions, (cust: any) => {
        return find(prevProps.customerOptions, { value: cust.value })
          ? false
          : true;
      });
      this.userForm.patchValue({ customerID: newCustomer[0] });
    }
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
    const facilitiesArray = map(
      this.userForm.value.facilities,
      (option: { value: string; label: string }) => {
        return { id: option.value };
      }
    );
    const securityFunctionsArray = map(
      this.userForm.value.securityFunctions,
      (option: { value: string; label: string }) => {
        return option.value;
      }
    );
    this.props.updateUser({
      id: this.props.selectedUser.id,
      ...this.userForm.value,
      customerID: this.userForm.value.customerID.value,
      facilities: facilitiesArray,
      securityFunctions: securityFunctionsArray,
      email: this.props.selectedUser.email // have to add back the email because disabling the input removes it
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
    const selectedCustomer = this.userForm
      ? this.userForm.value.customerID
      : undefined;

    const formClassName = `clearfix beacon-form ${this.props.colorButton}`;

    return (
      <div>
        <form onSubmit={this.handleSubmit} className={formClassName}>
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.fieldConfig}
          />
          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.props.toggleModal}
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
        <EditFacilityModal
          t={this.props.t}
          colorButton={this.props.colorButton}
          selectedCustomer={selectedCustomer}
        />
      </div>
    );
  }
}
export default translate('user')(EditUserForm);
