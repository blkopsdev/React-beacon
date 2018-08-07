/* 
* UserQueueForm 
* Edit and approve new users
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl
} from 'react-reactive-form';
import { Col, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { forEach } from 'lodash';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { IqueueUser } from '../../models';

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
    meta: { label: 'User Supplied Customer', colWidth: 12 }
  },
  customerID: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInputWithButton,
    meta: {
      label: 'Customer',
      colWidth: 12,
      type: 'text',
      buttonName: 'Add New Customer',
      buttonAction: () => {
        alert('functionality under construction');
      }
    }
  },

  providedAddress: {
    render: TextLabel,
    meta: { label: 'User Supplied Facility Address', colWidth: 12 }
  },
  facilityID: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInputWithButton,
    meta: {
      label: 'Facility',
      colWidth: 12,
      type: 'text',
      buttonName: 'Add New Facility',
      buttonAction: () => {
        alert('functionality under construction');
      }
    }
  },
  $field_0: {
    isStatic: false,
    render: ({
      meta: { handleCancel, cancelText, submitText, loading }
    }: any) => (
      <Col xs={12} className="form-buttons">
        <Button bsStyle="link" type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button bsStyle="warning" type="submit" disabled={loading} className="">
          Save
        </Button>
        <Button
          bsStyle="warning"
          type="button"
          disabled={loading}
          className="pull-right"
        >
          Save & Approve
        </Button>
      </Col>
    )
  }
};

interface Iprops extends React.Props<UserQueueForm> {
  handleSubmit: any;
  handleCancel: any;
  user: IqueueUser;
}
interface Istate {
  queueForm: any;
}
export default class UserQueueForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      queueForm: {}
    };
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
      customerID: 'AAA5D95C-129F-4837-988C-0BF4AE1F3B67'
    });
    this.userForm.patchValue({
      facilityID: 'BBB5D95C-129F-4837-988C-0BF4AE1F3B67'
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
    // console.log(this.userForm.value);
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    this.props.handleSubmit({
      id: this.props.user.user.id,
      ...this.userForm.value
    });
  };
  setForm = (form: AbstractControl) => {
    if (this.state.queueForm.status) {
      this.userForm = this.state.queueForm;
    } else {
      this.userForm = form;
      this.setState({ queueForm: form });
    }
    this.userForm.meta = {
      handleCancel: this.props.handleCancel,
      loading: false
    };
  };
  render() {
    const fieldConfig = {
      controls: { ...userBaseConfigControls, ...fieldConfigControls }
    };
    return (
      <div className="user-form">
        <form onSubmit={this.handleSubmit} className="user-form">
          <FormGenerator onMount={this.setForm} fieldConfig={fieldConfig} />
        </form>
      </div>
    );
  }
}
