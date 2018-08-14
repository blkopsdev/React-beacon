/* 
* UserQueueForm 
* Edit and approve new users
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { forEach } from 'lodash';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { IqueueObject } from '../../models';

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

// Field config to configure form
const fieldConfigControls = {
  tempCompany: {
    render: TextLabel,
    meta: { label: 'userQueue:userCustomer', colWidth: 12 }
  },
  cust: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInputWithButton,
    meta: {
      label: 'userQueue:customer',
      colWidth: 12,
      type: 'text',
      buttonName: 'userQueue:addCustomerButton',
      buttonAction: () => {
        alert('functionality under construction');
      }
    }
  },

  providedAddress: {
    render: TextLabel,
    meta: { label: 'userQueue:providedAddress', colWidth: 12 }
  },
  fac: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInputWithButton,
    meta: {
      label: 'userQueue:facility',
      colWidth: 12,
      type: 'text',
      buttonName: 'userQueue:facilityButton',
      buttonAction: () => {
        alert('functionality under construction');
      }
    }
  }
};
const fieldConfig = {
  controls: { ...userBaseConfigControls, ...fieldConfigControls }
};

interface Iprops extends React.Props<UserQueueForm> {
  handleSubmit: any;
  handleCancel: any;
  user: IqueueObject;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
}

class UserQueueForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(fieldConfig, this.props.t);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }

  componentDidMount() {
    // set values
    forEach(this.props.user.user, (value, key) => {
      this.userForm.patchValue({ [key]: value });
    });
    // TODO: CHANGE TO REAL CUSTOMER STUFF
    // hardcode CustomerID for now
    this.userForm.patchValue({
      cust: 'Big Pixel'
    });
    this.userForm.patchValue({
      fac: 'HQ Raleigh'
    });
    const {
      tempAddress,
      tempAddress2,
      tempCity,
      tempState,
      tempZip
    } = this.props.user.user;
    const providedAddress = `${tempAddress} ${tempAddress2} ${tempCity} ${tempState} ${tempZip}`;
    this.userForm.patchValue({ providedAddress });
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
    this.props.handleSubmit(
      // TESTING with hard coded data
      {
        id: this.props.user.user.id,
        ...this.userForm.value,
        customerID: 'AAA5D95C-129F-4837-988C-0BF4AE1F3B67',
        facilityID: 'BBB5D95C-129F-4837-988C-0BF4AE1F3B67'
      },
      shouldApprove,
      this.props.user.id
    );
    //     this.props.handleSubmit(
    //   {
    //     id: this.props.user.user.id,
    //     ...this.userForm.value
    //   },
    //   shouldApprove,
    //   this.props.user.id
    // );
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };
  render() {
    const { t } = this.props;
    return (
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
    );
  }
}
export default translate('user')(UserQueueForm);
