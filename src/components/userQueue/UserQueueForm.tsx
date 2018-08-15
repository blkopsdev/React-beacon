/* 
* UserQueueForm 
* Edit and approve new users
* Note: react-reactive-form is used for all form elements except for the facilities select, because we could not
* figure out how to update the options for the select after the customer was selected.
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { forEach, find } from 'lodash';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import Select, { components } from 'react-select';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { IqueueObject } from '../../models';

// add the bootstrap form-control class to the react-select select component
const ControlComponent = (props: any) => (
  <div>
    <components.Control {...props} className="form-control" />
  </div>
);

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
  customerID?: string,
  facilityID?: string
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
        getFacilitiesByCustomer,
        label: 'common:customer',

        colWidth: 12,
        placeholder: 'userQueue:customerSearchPlaceholder',
        buttonName: 'userQueue:addCustomerButton',
        buttonAction: () => {
          alert('functionality under construction');
        },
        value: customerID,
        loadOptions: (value: any, callback: any) => {
          callback(customerOptions);
        }
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
  user: IqueueObject;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customerOptions: any[];
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  facilityOptions: any[];
}
interface Istate {
  facility: { value: string; label: string };
  pristine: boolean;
}

class UserQueueForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(
        this.props.customerOptions,
        this.props.facilityOptions,
        this.props.getFacilitiesByCustomer,
        this.props.user.user.customerID,
        this.props.user.user.facilityID
      ),
      this.props.t
    );
    this.state = {
      facility: { value: '', label: '' },
      pristine: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  componentDidUpdate(prevProps: Iprops) {
    if (prevProps.facilityOptions !== this.props.facilityOptions) {
      if (this.props.facilityOptions.length) {
        const { facilityID } = this.props.user.user;
        const facility = find(
          this.props.facilityOptions,
          (option: { value: string; label: string }) => {
            return option.value === facilityID;
          }
        );
        this.setState({ facility });
      }
    }
  }

  componentDidMount() {
    // set values
    forEach(this.props.user.user, (value, key) => {
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
    } = this.props.user.user;
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
    // console.log(this.userForm.value);
    this.props.handleSubmit(
      {
        id: this.props.user.user.id,
        ...this.userForm.value,
        customerID: this.userForm.value.customerID.value,
        facilityID: this.state.facility.value
      },
      shouldApprove,
      this.props.user.id
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

    let facilityClassName = '';
    if (this.state.facility.value && !this.state.pristine) {
      facilityClassName = 'has-success';
    } else if (!this.state.facility.value && !this.state.pristine) {
      facilityClassName = 'has-error';
    }
    return (
      <div className="user-form queue-form">
        <form onSubmit={this.handleSubmit} className="user-form">
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.fieldConfig}
          />
          <Col xs={12}>
            <FormGroup bsSize="sm">
              <ControlLabel>{t('common:facility')}</ControlLabel>
              <Button
                bsStyle="link"
                className="pull-right right-side"
                onClick={() => {
                  alert('button clicked');
                }}
              >
                {t('userQueue:facilityButton')}
              </Button>
              <Select
                className={facilityClassName}
                options={this.props.facilityOptions}
                onChange={(facility: any) => {
                  this.setState({ facility });
                }}
                components={{ Control: ControlComponent }}
                placeholder={t('userQueue:facilitySearchPlaceholder')}
                onBlur={() => {
                  this.setState({ pristine: false });
                }}
              />
            </FormGroup>
          </Col>
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
    );
  }
}
export default translate('user')(UserQueueForm);
