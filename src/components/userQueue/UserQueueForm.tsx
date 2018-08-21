/* 
* UserQueueForm 
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
import { Col, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { forEach, find, filter } from 'lodash';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
// import Select, { components } from 'react-select';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { IqueueObject } from '../../models';
import EditFacilityModal from '../common/EditFacilityModal';

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
  toggleEditCustomerModal: () => void,
  toggleEditFacilityModal: () => void
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
        buttonAction: toggleEditFacilityModal
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
  handleSubmit: any;
  handleCancel: any;
  selectedQueueObject: IqueueObject;
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
    if (
      prevProps.facilityOptions.length !== this.props.facilityOptions.length
    ) {
      const facilitySelectControl = this.userForm.get(
        'facilityID'
      ) as AbstractControlEdited;
      facilitySelectControl.meta.options = this.props.facilityOptions;
      facilitySelectControl.stateChanges.next();
      // now select the facility the user just added
      // might be a better way to do this, but we are comparing the two arrays and finding the new facility
      const newFacility = filter(this.props.facilityOptions, (obj: any) => {
        return find(prevProps.facilityOptions, { value: obj.value })
          ? false
          : true;
      });
      this.userForm.patchValue({ facilityID: newFacility[0] });
    }

    if (
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
    // TODO: CHANGE TO REAL CUSTOMER STUFF
    // hardcode CustomerID for now
    this.userForm.patchValue({
      fac: 'HQ Raleigh'
    });
    const {
      tempAddress,
      tempAddress2,
      tempCity,
      tempState,
      tempZip,
      customerID
    } = this.props.selectedQueueObject.user;
    const providedAddress = `${tempAddress} ${tempAddress2} ${tempCity} ${tempState} ${tempZip}`;
    this.userForm.patchValue({ providedAddress });
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
    this.props.handleSubmit(
      {
        id: this.props.selectedQueueObject.user.id,
        ...this.userForm.value,
        customerID: this.userForm.value.customerID.value,
        facilityID: this.userForm.value.facilityID.value
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

    return (
      <div>
        <div className="user-form queue-form">
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
