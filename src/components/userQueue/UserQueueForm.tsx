/* 
* UserQueueForm 
* Edit and approve new users
* Note: react-reactive-form is used for all form elements except for the facilities select, because we could not
* figure out how to update the options for the select after the customer was selected.
* the only problem with this is that the validation is complicated by having one field outside the generated form.
* TODO a) wait for a response to your question here:  https://github.com/bietkul/react-reactive-form/issues/5
* 
*/

import { Col, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable
} from 'react-reactive-form';
import { forEach, find, filter, map, differenceBy } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { Ioption, IqueueObject } from '../../models';
import {
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import {
  toggleEditQueueUserModal,
  updateQueueUser
} from '../../actions/userQueueActions';
import EditFacilityModal from '../common/EditFacilityModal';
import constants from '../../constants/constants';

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const TextLabel = ({ handler, meta }: any) => {
  return (
    <Col xs={meta.colWidth}>
      <FormGroup bsSize="sm">
        <ControlLabel>{meta.label}</ControlLabel>
        <h5 className="queue-form-label">{handler().value}</h5>
      </FormGroup>
    </Col>
  );
};
const buildFieldConfig = (
  customerOptions: any[],
  facilityOptions: any[],
  getFacilitiesByCustomer: (value: string) => Promise<void>,
  toggleEditCustomerModalCB: typeof toggleEditCustomerModal,
  toggleEditFacilityModalCB: typeof toggleEditFacilityModal
) => {
  // Field config to configure form
  const fieldConfigControls = {
    tempCompany: {
      render: TextLabel,
      meta: { label: 'userQueue:userCustomer', colWidth: 12 }
    },
    customerID: {
      render: FormUtil.SelectWithButton,
      meta: {
        options: customerOptions,
        label: 'common:customer',

        colWidth: 12,
        placeholder: 'userQueue:customerSearchPlaceholder',
        buttonName: 'userQueue:addCustomerButton',
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

    providedAddress: {
      render: TextLabel,
      meta: { label: 'userQueue:providedAddress', colWidth: 12 }
    }
  };
  const fieldConfig = {
    controls: { ...userBaseConfigControls, ...fieldConfigControls }
  };
  return fieldConfig as FieldConfig;
};

interface Iprops extends React.Props<UserQueueForm> {
  selectedQueueObject: IqueueObject;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customerOptions: any[];
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  facilityOptions: any[];
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
  toggleEditQueueUserModal: typeof toggleEditQueueUserModal;
  updateQueueUser: typeof updateQueueUser;
  approveUser: (userQueueID: string) => void;
}

class UserQueueForm extends React.Component<Iprops, {}> {
  private userForm: AbstractControl;
  private fieldConfig: FieldConfig;
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
    if (!this.props.selectedQueueObject) {
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
      console.log(
        'received new facilities',
        this.props.facilityOptions,
        prevProps.facilityOptions
      );
      const facilitySelectControl = this.userForm.get(
        'facilities'
      ) as AbstractControlEdited;
      facilitySelectControl.meta.options = this.props.facilityOptions;
      facilitySelectControl.stateChanges.next();
      // update which options are selected
      const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
        return find(this.props.selectedQueueObject.user.facilities, {
          id: fac.value
        })
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

  componentDidMount() {
    if (!this.props.selectedQueueObject) {
      console.error('missing user');
      return;
    }
    // set values
    forEach(this.props.selectedQueueObject.user, (value, key) => {
      this.userForm.patchValue({ [key]: value });
    });
    const {
      tempAddress = 'none',
      tempAddress2 = '',
      tempCity = '',
      tempState = '',
      tempZip = '',
      customerID,
      facilities
    } = this.props.selectedQueueObject.user;
    const providedAddress = `${tempAddress} ${tempAddress2} ${tempCity} ${tempState} ${tempZip}`;
    this.userForm.patchValue({ providedAddress });
    this.userForm.patchValue({
      customerID: find(
        this.props.customerOptions,
        (cust: Ioption) => cust.value === customerID
      )
    });
    const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
      return find(facilities, { id: fac.value }) ? true : false;
    });
    this.userForm.patchValue({ facilities: facilitiesArray });

    // if there is a customerID then get facilities
    if (customerID.length) {
      this.props.getFacilitiesByCustomer(customerID);
    }

    document.addEventListener('newFacility', this.handleNewFacility, false);
    const customerSelectControl = this.userForm.get(
      'customerID'
    ) as AbstractControlEdited;
    customerSelectControl.stateChanges.subscribe(() => {
      // get
      console.log('customer changed');
    });

    const emailControl = this.userForm.get('email') as AbstractControlEdited;
    emailControl.disable();
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
    shouldApprove: boolean = false
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
    this.props.updateQueueUser(
      {
        id: this.props.selectedQueueObject.user.id,
        ...this.userForm.value,
        customerID: this.userForm.value.customerID.value,
        facilities: facilitiesArray,
        email: this.props.selectedQueueObject.user.email // have to add back the email because disabling the input removes it
      },
      shouldApprove,
      this.props.selectedQueueObject.id
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

    const formClassName = `user-form queue-form ${this.props.colorButton}`;

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
                onClick={this.props.toggleEditQueueUserModal}
              >
                {t('cancel')}
              </Button>
              <Button
                bsStyle={this.props.colorButton}
                type="submit"
                disabled={this.props.loading}
                style={{ marginRight: '20px' }}
              >
                {t('save')}
              </Button>
              <Button
                bsStyle={this.props.colorButton}
                type="button"
                disabled={this.props.loading}
                onClick={(e: any) => this.handleSubmit(e, true)}
              >
                {t('saveApprove')}
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
export default translate('user')(UserQueueForm);
